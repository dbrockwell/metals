import React, { Component } from 'react';
import Metal from './Metal';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Badge, Grid } from '@mui/material';
import { amber , brown, grey } from '@mui/material/colors';

class Country extends Component { 

    total() {
        return this.props.country.gold + this.props.country.silver + this.props.country.bronze
    }

    render() {
        const { country, add, subtract } = this.props;
        return (
            <div class="countryCard">
                <Grid item>
                <Card sx={{ maxWidth: 350 }}>
                <CardContent>
                <Badge color="secondary" badgeContent={this.total()}>
                <Typography variant="h5"> {country.country} </Typography>
                </Badge>
                <hr></hr>
                <Metal 
                country={ country }
                add={add}
                subtract={subtract}
                metal={ country.gold }
                metalName={ "Gold" }
                color={ amber[500] }/>
                <Metal 
                country={ country }
                add={add}
                subtract={subtract}
                metal={ country.silver }
                metalName={ "Silver" }
                color={ grey[400] }/>
                <Metal 
                country={ country }
                add={add}
                subtract={subtract}
                metal={ country.bronze }
                metalName={ "Bronze" }
                color={ brown[500] }/>
                </CardContent>
                </Card>
                </Grid>
            </div>
        );
    }
}

export default Country