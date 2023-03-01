import React from 'react';
import Metal from './Metal';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Chip, Grid, IconButton } from '@mui/material';
import { amber , brown, grey, red, blue } from '@mui/material/colors';
import { Stack } from '@mui/system';
import { Delete, SaveAlt, Undo } from '@mui/icons-material';

const Country = (props) => {

    const { country, medals, add, subtract, onDelete, onSave, onReset } = props;

    const total = (country, medals) => {
        let sum = 0;
        medals.forEach(medal => { sum += country[medal.name].page_value; });
        return sum;
    }
    const renderSaveButton = () => {
        let unsaved = false;
        medals.forEach(medal => {
          if (country[medal.name].page_value !== country[medal.name].saved_value) {
            unsaved = true;
          }
        });
        return unsaved;
      }
        return (
            <div className="countryCard">
                <Grid item>
                <Card sx={{ minWidth: 300 }}>
                <CardContent>
                <Stack direction="row" justifyContent="space-between">
                    <div>
                    <Stack direction="row" spacing={1}>
                    <Typography variant="h5"> {country.name} </Typography>
                    <Chip label={total(country, medals)} color="secondary" size="small"/>
                    </Stack>
                    </div>
                    { renderSaveButton() ?
                        <React.Fragment>
                        <IconButton aria-label="delete" onClick={ () => onSave(country.id) } sx={{ color: blue[500] }}>
                            <SaveAlt />
                        </IconButton>
                        <IconButton aria-label="delete" onClick={ () => onReset(country.id) } sx={{ color: red[500] }}>
                            <Undo />
                        </IconButton>
                        </React.Fragment>
                        :
                        <IconButton aria-label="delete" onClick={ () => onDelete(country.id) } sx={{ color: red[500] }}>
                            <Delete />
                        </IconButton>
                    }
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