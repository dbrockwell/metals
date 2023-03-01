import { AppBar, Chip, Grid, Toolbar, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';
import AddCountry from './components/AddCountry';
import Country from './components/Country';

const App = () => {
  const [countries, setCountries] = useState([]);
  const medals = useRef([
    { id: 1, name: 'gold' },
    { id: 2, name: 'silver' },
    { id: 3, name: 'bronze' },
  ]);
  const apiEndpoint = "https://medals-23-dab.azurewebsites.net/Api/country";
  useEffect(() => {
    async function fetchData() {
      const { data: fetchedCountries } = await axios.get(apiEndpoint);
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
  }, []);
  const handleSave = async (countryId) => {
    const originalCountries = countries;

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
      await axios.patch(`${apiEndpoint}/${countryId}`, jsonPatch);
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        // country already deleted
        console.log("The record does not exist - it may have already been deleted");
      } else { 
        alert('An error occurred while updating');
        setCountries(originalCountries);
      }
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
    const originalCountries = countries;
    setCountries(countries.filter(w => w.id !== countryId));
    try {
      await axios.delete(`${apiEndpoint}/${countryId}`);
    } catch(ex) {
      if (ex.response && ex.response.status === 404) {
        console.log("The record does not exist - it may have already been deleted");
      } else { 
        alert('An error occurred while deleting a country');
        setCountries(originalCountries);
      }
    }
  }
  const handleAdd = async (country) => {
    const { data: post } = await axios.post(apiEndpoint, { name: country });
    let newCountry = { 
      id: post.id, 
      name: post.name,
    };
    medals.current.forEach(medal => {
      const count = post[medal.name];
      newCountry[medal.name] = { page_value: count, saved_value: count };
    });
    setCountries(countries.concat(newCountry));
  }
    return ( 
      <div className="App">
        <header className="App-header">
          <AppBar position="static">
            <Toolbar>
              <Stack direction="row" spacing={1}>
                <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                  Olympic Medals
                </Typography>
                <Chip label={totalMetals()} color="secondary" size="small"/>
              </Stack>
            </Toolbar>
          </AppBar>
        </header>
        <Grid container spacing={2}>
            { countries.map(country => 
              <Country
                key={ country.id } 
                country={ country }
                medals={ medals.current }
                add={addMetal}
                subtract={subtractMetal}
                onDelete={deleteCountry}
                onSave={ handleSave }
                onReset={ handleReset }
                />
            )}
        </Grid>
        <AddCountry onAdd={ handleAdd }/>
      </div>
     );
}

export default App;