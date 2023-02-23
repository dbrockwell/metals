import React from 'react';
import Metal from './Metal';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Chip, Grid, IconButton } from '@mui/material';
import { amber , brown, grey, red } from '@mui/material/colors';
import { Stack } from '@mui/system';
import { Delete } from '@mui/icons-material';

const Country = (props) => {

    const total = () => {
        return props.country.gold + props.country.silver + props.country.bronze
    }
        const { country, add, subtract, onDelete } = props;
        return (
            <div className="countryCard">
                <Grid item>
                <Card sx={{ minWidth: 300 }}>
                <CardContent>
                <Stack direction="row" justifyContent="space-between">
                    <div>
                    <Stack direction="row" spacing={1}>
                    <Typography variant="h5"> {country.name} </Typography>
                    <Chip label={total()} color="secondary" size="small"/>
                    </Stack>
                    </div>
                    <IconButton aria-label="delete" onClick={ () => onDelete(country.id) } sx={{ color: red[500] }}>
                        <Delete />
                    </IconButton>
                </Stack>
                <hr/>
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

export default Country