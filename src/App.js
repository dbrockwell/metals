import { AppBar, Chip, Grid, Toolbar, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import React, { Component } from 'react';
import './App.css';
import AddCountry from './components/AddCountry';
import Country from './components/Country';

class App extends Component {
  state = {
    countries: [
      { id: 1, country: 'United States', gold: 2, silver: 6, bronze: 12 },
      { id: 2, country: 'China', gold: 3, silver: 5, bronze: 13 },
      { id: 3, country: 'Germany', gold: 0, silver: 2, bronze: 8 },
    ]
  }
  addMetal = (countryId, metal) => {
    const countriesMutable = [...this.state.countries];
    const idx = countriesMutable.findIndex((c) => c.id === countryId);
    countriesMutable[idx][metal] += 1;
    this.setState({ countries : countriesMutable });
  }
  subtractMetal = (countryId, metal) => {
    const countriesMutable = [...this.state.countries];
    const idx = countriesMutable.findIndex((c) => c.id === countryId);
    countriesMutable[idx][metal] -= 1;
    this.setState({ countries : countriesMutable });
  }
  totalMetals = () => { 
    const gold = this.state.countries.reduce((a, b) => a + b.gold, 0);
    const silver = this.state.countries.reduce((a, b) => a + b.silver, 0);
    const bronze = this.state.countries.reduce((a, b) => a + b.bronze, 0);
    return gold + silver + bronze
  }
  deleteCountry = (countryId) => {
    const countries = this.state.countries.filter(w => w.id !== countryId);
    this.setState({ countries:countries });
  }
  handleAdd = (country) => {
    const { countries } = this.state;
    const id = countries.length === 0 ? 1 : Math.max(...countries.map(country => country.id)) + 1;
    const mutableCountries = countries.concat({ id: id, country: country, gold: 0, silver: 0, bronze: 0 });
    this.setState({ countries:mutableCountries });
  }
  render() { 
    return ( 
      <div className="App">
        <header className="App-header">
          <AppBar position="static">
            <Toolbar>
              <Stack direction="row" spacing={1}>
                <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                  Olympic Medals
                </Typography>
                <Chip label={this.totalMetals()} color="secondary" size="small"/>
              </Stack>
            </Toolbar>
          </AppBar>
        </header>
        <Grid container spacing={2}>
            { this.state.countries.map(country => 
              <Country
                key={ country.id } 
                country={ country }
                add={this.addMetal}
                subtract={this.subtractMetal}
                onDelete={this.deleteCountry}
                />
            )}
        </Grid>
        <AddCountry onAdd={ this.handleAdd }/>
      </div>
     );
  }
}

export default App;