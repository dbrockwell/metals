import React, { Component } from 'react';
import Avatar from '@mui/material/Avatar';
import { blue, red } from '@mui/material/colors';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { Add, Remove } from '@mui/icons-material';
import Typography from '@mui/material/Typography';

class Metal extends Component { 
    // state = {
    //     count: this.props.count
    // }

    // addMetal = () => { 
    //     this.setState({ count: this.state.count + 1})
    // }

    // subtractMetal = () => { 
    //     this.setState({ count: this.state.count - 1})
    // }

    render() {
        const { country, add, subtract, color, metal, metalName } = this.props;
        return (
            <div class="metal">
                <Stack direction="row" spacing={1}>
                <Avatar sx={{ bgcolor: color }}>{metal}</Avatar>
                <Typography sx={{ pt: 1, pr:6}}>
                    {metalName} Medals
                </Typography>
                <div class="buttons">
                <IconButton aria-label="delete" onClick={ () => add(country.id, metalName.toLowerCase()) } sx={{ color: blue[500] }}>
                    <Add />
                </IconButton>
                <IconButton disabled={metal === 0 ? true : false} aria-label="delete" onClick={ () => subtract(country.id, metalName.toLowerCase()) } sx={{ color: red[500] }}>
                    <Remove />
                </IconButton>
                </div>
                </Stack>
            </div>
        );
    }
}

export default Metal