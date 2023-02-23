import { AppBar, Chip, Grid, Toolbar, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import AddCountry from './components/AddCountry';
import Country from './components/Country';

const App = () => {
  const [countries, setCountries] = useState([]);
  const apiEndpoint = "https://medals-23-dab.azurewebsites.net/Api/country";
  useEffect(() => {
    async function fetchData() {
      const { data: fetchedWords } = await axios.get(apiEndpoint);
      setCountries(fetchedWords);
    }
    fetchData();
  }, []);
  const addMetal = (countryId, metal) => {
    const countriesMutable = [...countries];
    const idx = countriesMutable.findIndex((c) => c.id === countryId);
    countriesMutable[idx][metal] += 1;
    setCountries(countriesMutable );
  }
  const subtractMetal = (countryId, metal) => {
    const countriesMutable = [...countries];
    const idx = countriesMutable.findIndex((c) => c.id === countryId);
    countriesMutable[idx][metal] -= 1;
    setCountries(countriesMutable);
  }
  const totalMetals = () => { 
    const gold = countries.reduce((a, b) => a + b.gold, 0);
    const silver = countries.reduce((a, b) => a + b.silver, 0);
    const bronze = countries.reduce((a, b) => a + b.bronze, 0);
    return gold + silver + bronze
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
    const { data: post } = await axios.post(apiEndpoint, { name: country, gold: 0, silver: 0, bronze: 0 });
    setCountries(countries.concat(post));
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
                add={addMetal}
                subtract={subtractMetal}
                onDelete={deleteCountry}
                />
            )}
        </Grid>
        <AddCountry onAdd={ handleAdd }/>
      </div>
     );
}

export default App;