import { AppBar, Chip, Grid, Toolbar, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import Button from '@mui/material/Button';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { BrowserRouter, BrowserRouter as Router, Route} from 'react-router-dom'
import jwtDecode from 'jwt-decode';
import './App.css';
import AddCountry from './components/AddCountry';
import Login from './components/Login';
import Country from './components/Country';

const App = () => {
  const [ countries, setCountries ] = useState([]);
  const [ connection, setConnection] = useState(null);
  const [ user, setUser ] = useState(
    {
      name: null,
      canPost: false,
      canPatch: false,
      canDelete: false
    }
  );
  const medals = useRef([
    { id: 1, name: 'gold' },
    { id: 2, name: 'silver' },
    { id: 3, name: 'bronze' },
  ]);
  //const apiEndpoint = "https://medals-23-dab.azurewebsites.net/api/country";
  const jwtApiEndPoint = "https://medals-23-dab.azurewebsites.net/jwt/api/country";
  const hubEndpoint = "https://medals-23-dab.azurewebsites.net/medalsHub";
  const usersEndpoint = "https://medalsapi.azurewebsites.net/api/users/login";

  const latestCountries = useRef(null);
  // latestCountries.current is a ref variable to countries
  // this is needed to access state variable in useEffect w/o dependency
  latestCountries.current = countries;
  useEffect(() => {
    async function fetchData() {
      const { data: fetchedCountries } = await axios.get(jwtApiEndPoint);
      let newCountries = [];
      fetchedCountries.forEach(country => {
        let newCountry = {
          id: country.id,
          name: country.name,
        };
        medals.current.forEach(medal => {
          const count = country[medal.name];
          newCountry[medal.name] = { page_value: count, saved_value: count };
        });
        newCountries.push(newCountry);
      });
      setCountries(newCountries);
    }
    fetchData();

    const encodedJwt = localStorage.getItem("token");
    // check for existing token
    if (encodedJwt) {
      setUser(getUser(encodedJwt));
    }
    
    // signalR
    const newConnection = new HubConnectionBuilder()
      .withUrl(hubEndpoint)
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  // componentDidUpdate (changes to connection)
  useEffect(() => {
    if (connection) {
      connection.start()
      .then(() => {
        console.log('Connected!')
        
        connection.on('ReceiveAddMessage', country => {
          console.log(`Add: ${country.name}`);
          
          let newCountry = { 
            id: country.id, 
            name: country.name,
          };
          medals.current.forEach(medal => {
            const count = country[medal.name];
            newCountry[medal.name] = { page_value: count, saved_value: count };
          });
          let mutableCountries = [...latestCountries.current];
          mutableCountries = mutableCountries.concat(newCountry);
          setCountries(mutableCountries);
        });
        
        connection.on('ReceiveDeleteMessage', id => {
          console.log(`Delete id: ${id}`);
          let mutableCountries = [...latestCountries.current];
          mutableCountries = mutableCountries.filter(c => c.id !== id);
          setCountries(mutableCountries);
        });

        
        connection.on('ReceivePatchMessage', country => {
          console.log(`Patch: ${country.name}`);
          let updatedCountry = {
            id: country.id,
            name: country.name,
          }
          medals.current.forEach(medal => {
            const count = country[medal.name];
            updatedCountry[medal.name] = { page_value: count, saved_value: count };
          });
          let mutableCountries = [...latestCountries.current];
          const idx = mutableCountries.findIndex(c => c.id === country.id);
          mutableCountries[idx] = updatedCountry;

          setCountries(mutableCountries);
        });
      })
      .catch(e => console.log('Connection failed: ', e));
    }
  // useEffect is dependent on changes connection
  }, [connection]);
  const handleSave = async (countryId) => {
    const originalCountries = countries;
    if (isValidToken())
    {
      const idx = countries.findIndex(c => c.id === countryId);
      const mutableCountries = [ ...countries ];
      const country = mutableCountries[idx];
      let jsonPatch = [];
      medals.current.forEach(medal => {
        if (country[medal.name].page_value !== country[medal.name].saved_value) {
          jsonPatch.push({ op: "replace", path: medal.name, value: country[medal.name].page_value });
          country[medal.name].saved_value = country[medal.name].page_value;
        }
      });
      console.log(`json patch for id: ${countryId}: ${JSON.stringify(jsonPatch)}`);
      // update state
      setCountries(mutableCountries);

      try {
        await axios.patch(`${jwtApiEndPoint}/${countryId}`, jsonPatch, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
      } catch (ex) {
        if (ex.response && ex.response.status === 404) {
          // country does not exist
          console.log("The record does not exist - it may have been deleted");
        } else if (ex.response && ex.response.status === 401) { 
          // perhaps token has expired
          alert('You are not authorized to complete this request');
        } else if (ex.response) {
          console.log(ex.response);
        } else {
          console.log("Request failed");
        }
        setCountries(originalCountries);
      }
    } else {
      alert('Your token has expired');
      setCountries(originalCountries);
    }
  }
  const handleReset = (countryId) => {
    const idx = countries.findIndex(c => c.id === countryId);
    const mutableCountries = [ ...countries ];
    const country = mutableCountries[idx];
    medals.current.forEach(medal => {
      country[medal.name].page_value = country[medal.name].saved_value;
    });
    setCountries(mutableCountries);
  }
  const addMetal = (countryId, medal) => handleUpdate(countryId, medal, 1);
  const subtractMetal = (countryId, medal) => handleUpdate(countryId, medal, -1);
  const handleUpdate = (countryId, medal, factor) => {
    const idx = countries.findIndex(c => c.id === countryId);
    const mutableCountries = [...countries ];
    mutableCountries[idx][medal].page_value += (1 * factor);
    setCountries(mutableCountries);
  }
  const totalMetals = () => { 
    let sum = 0;
    medals.current.forEach(medal => { sum += countries.reduce((a, b) => a + b[medal.name].page_value, 0); });
    return sum;
  }
  const deleteCountry = async (countryId) => {
    // check for valid token based on token exp
    if (isValidToken())
    {
      const originalCountries = countries;
      setCountries(countries.filter(c => c.id !== countryId));
      try {
        await axios.delete(`${jwtApiEndPoint}/${countryId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
      } catch (ex) {
        if (ex.response && ex.response.status === 404) {
          // country already deleted
          console.log("The record does not exist - it may have already been deleted");
        } else { 
          setCountries(originalCountries);
          if (ex.response && ex.response.status === 401) {
            // perhaps token has expired
            alert("You are not authorized to complete this request");
          } else if (ex.response) {
            console.log(ex.response);
          } else {
            console.log("Request failed");
          }
        }
      }
    } else {
      alert('Your token has expired');
    }
  }
  const handleAdd = async (country) => {
    // check for valid token based on token exp
    if (isValidToken())
    {
      console.log('valid');
      try {
        await axios.post(jwtApiEndPoint, {
          name: country
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
      } catch (ex) {
        if (ex.response && ex.response.status === 401) {
          // perhaps token has expired
          alert("You are not authorized to complete this request");
        } else if (ex.response) {
          console.log(ex.response);
        } else {
          console.log("Request failed");
        }
      }
    } else {
      alert('Your token has expired');
    }
  }
  const handleLogin = async (username, password) => {
    try {
      const resp = await axios.post(usersEndpoint, { username: username, password: password });
      // save token to local storage
      const encodedJwt = resp.data.token;
      localStorage.setItem('token', encodedJwt);
      setUser(getUser(encodedJwt));
    } catch (ex) {
      if (ex.response && (ex.response.status === 401 || ex.response.status === 400 )) {
        alert("Login failed");
      } else if (ex.response) {
        console.log(ex.response);
      } else {
        console.log("Request failed");
      }
    }
  }
  const handleLogout = (e) => {
    e.preventDefault();
    console.log('logout');
    localStorage.removeItem('token');
    setUser({
      name: null,
      canPost: false,
      canPatch: false,
      canDelete: false
    });
    return false;
  }
  const isValidToken = () => {
    const encodedJwt = localStorage.getItem("token");
    // check for existing token
    if (encodedJwt) {
      const decodedJwt = jwtDecode(encodedJwt);
      const diff = Date.now() - (decodedJwt['exp'] * 1000);
      if (diff < 0) {
        console.log(`token expires in ${parseInt((diff * -1) / 60000)} minutes`);
        return true;
      } else {
        console.log(`token expired ${parseInt(diff / 60000)} minutes ago`);
        localStorage.removeItem('token');
        setUser({
          name: null,
          canPost: false,
          canPatch: false,
          canDelete: false,
        });
      }
    }
    return false;
  }
  const getUser = (encodedJwt) => {
    const decodedJwt = jwtDecode(encodedJwt);
    const diff = Date.now() - (decodedJwt['exp'] * 1000);
    if (diff < 0) {
      console.log(`token expires in ${parseInt((diff * -1) / 60000)} minutes`);
      return {
        name: decodedJwt['username'],
        canPost: decodedJwt['roles'].indexOf('medals-post') === -1 ? false : true,
        canPatch: decodedJwt['roles'].indexOf('medals-patch') === -1 ? false : true,
        canDelete: decodedJwt['roles'].indexOf('medals-delete') === -1 ? false : true,
      };
    } else {
      console.log(`token expired ${parseInt(diff / 60000)} minutes ago`);
      localStorage.removeItem('token');
      return {
          name: null,
          canPost: false,
          canPatch: false,
          canDelete: false,
        };
    }
  }
    return ( 
      <Router>
      <div className="App">
        <header className="App-header">
          <AppBar position="static">
            <Toolbar>
                  <Stack direction="row" spacing={1}>
                    <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                      Olympic Medals
                    </Typography>
                    <Chip label={totalMetals()} color="secondary" size="small"/>
                    <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                        {user.name}
                      </Typography>
                    {user.name ? 
                      <Button variant="outlined" color="secondary" href="/" onClick={handleLogout}>Logout</Button>
                      :
                      <Button variant="contained" color="secondary" href="/login">Login</Button>
                  }
                  </Stack>
            </Toolbar>
          </AppBar>
        </header>
      <BrowserRouter basename='/metals/'>
      <Route exact path="/login">
        <Login onLogin={ handleLogin } />
      </Route>
      </BrowserRouter>
        <Grid container spacing={2}>
            { countries.map(country => 
              <Country
                key={ country.id } 
                country={ country }
                medals={ medals.current }
                canPatch={ user.canPatch }
                canDelete={ user.canDelete }
                add={addMetal}
                subtract={subtractMetal}
                onDelete={deleteCountry}
                onSave={ handleSave }
                onReset={ handleReset }
                />
            )}
        </Grid>
        { user.canPost && <AddCountry onAdd={ handleAdd }/>}
      </div>
      </Router>
     );
}

export default App;