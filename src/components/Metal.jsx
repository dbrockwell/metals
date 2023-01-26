import React, { Component } from 'react';
import Avatar from '@mui/material/Avatar';
import { amber, blue } from '@mui/material/colors';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { Add } from '@mui/icons-material';
import Typography from '@mui/material/Typography';

class Metal extends Component { 
    state = {
        metal: "Gold Metals",
        number: 0,
    }

    handleClick = () => { 
        this.setState({ number: this.state.number + 1})
    }

    render() {
        return (
            <div>
                <Stack direction="row" spacing={1}>
                <Avatar sx={{ bgcolor: amber[500] }}>{this.state.number}</Avatar>
                <Typography sx={{ pt: 1, pr:6}}>
                    {this.state.metal}
                </Typography>
                <IconButton aria-label="delete" onClick={ this.handleClick } sx={{ color: blue[500] }}>
                    <Add />
                </IconButton>
                </Stack>
            </div>
        );
    }
}

export default Metal