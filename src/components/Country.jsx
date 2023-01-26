import React, { Component } from 'react';
import Metal from './Metal';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

class Country extends Component { 
    state = {
        country: "United States"
    }

    render() {
        return (
            <div class="countryCard">
                <Card sx={{ maxWidth: 350 }}>
                <CardContent>
                <Typography variant="h5"> {this.state.country} </Typography>
                <hr></hr>
                <Metal />
                </CardContent>
                </Card>
            </div>
        );
    }
}

export default Country