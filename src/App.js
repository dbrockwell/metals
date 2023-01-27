import { Grid } from '@mui/material';
import React, { Component } from 'react';
import './App.css';
import Country from './components/Country';

class App extends Component {
  state = {
    countries: [
      { id: 1, country: 'United States', goldMedalCount: 2, silverMedalCount: 6, bronzeMedalCount: 12 },
      { id: 2, country: 'China', goldMedalCount: 3, silverMedalCount: 5, bronzeMedalCount: 13 },
      { id: 3, country: 'Germany', goldMedalCount: 0, silverMedalCount: 2, bronzeMedalCount: 8 },
    ]
  }
  render() { 
    return ( 
      <div className="App">
        <header className="App-header">
        </header>
        <Grid container spacing={2}>
            { this.state.countries.map(country => 
              <Country
                key={ country.id } 
                country={ country }
                />
            )}
        </Grid>
      </div>
     );
  }
}

export default App;