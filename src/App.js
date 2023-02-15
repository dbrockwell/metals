import { AppBar, Chip, Grid, Toolbar, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import React, { useState, useEffect } from 'react';
import './App.css';
import AddCountry from './components/AddCountry';
import Country from './components/Country';

const App = () => {
  const [countries, setCountries] = useState([]);
  useEffect(() => {
    let fetchedCountries = [
      { id: 1, country: 'United States', gold: 2, silver: 6, bronze: 12 },
      { id: 2, country: 'China', gold: 3, silver: 5, bronze: 13 },
      { id: 3, country: 'Germany', gold: 0, silver: 2, bronze: 8 },
    ]
    setCountries(fetchedCountries);
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
  const deleteCountry = (countryId) => {
    setCountries([...countries].filter(c => c.id !== countryId));
  }
  const handleAdd = (country) => {
    const id = countries.length === 0 ? 1 : Math.max(...countries.map(country => country.id)) + 1;
    const mutableCountries = countries.concat({ id: id, country: country, gold: 0, silver: 0, bronze: 0 });
    setCountries(mutableCountries);
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