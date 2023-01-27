import React, { Component } from 'react';
import Metal from './Metal';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import { amber , brown, grey } from '@mui/material/colors';

class Country extends Component { 

    render() {
        const { country } = this.props;
        return (
            <div class="countryCard">
                <Grid item>
                <Card sx={{ maxWidth: 350 }}>
                <CardContent>
                <Typography variant="h5"> {country.country} </Typography>
                <hr></hr>
                <Metal 
                count={ country.goldMedalCount }
                metal={ "Gold" }
                color={ amber[500] }/>
                <Metal 
                count={ country.silverMedalCount }
                metal={ "Silver" }
                color={ grey[400] }/>
                <Metal 
                count={ country.bronzeMedalCount }
                metal={ "Bronze" }
                color={ brown[600] }/>
                </CardContent>
                </Card>
                </Grid>
            </div>
        );
    }
}

export default Country