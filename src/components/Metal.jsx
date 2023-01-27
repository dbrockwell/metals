import React, { Component } from 'react';
import Avatar from '@mui/material/Avatar';
import { blue, red } from '@mui/material/colors';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { Add, Remove } from '@mui/icons-material';
import Typography from '@mui/material/Typography';

class Metal extends Component { 
    state = {
        count: this.props.count
    }

    addMetal = () => { 
        this.setState({ count: this.state.count + 1})
    }

    subtractMetal = () => { 
        this.setState({ count: this.state.count - 1})
    }

    render() {
        return (
            <div class="metal">
                <Stack direction="row" spacing={1}>
                <Avatar sx={{ bgcolor: this.props.color }}>{this.state.count}</Avatar>
                <Typography sx={{ pt: 1, pr:6}}>
                    {this.props.metal} Metals
                </Typography>
                <div class="buttons">
                <IconButton aria-label="delete" onClick={ this.addMetal } sx={{ color: blue[500] }}>
                    <Add />
                </IconButton>
                <IconButton disabled={this.state.count === 0 ? true : false} aria-label="delete" onClick={ this.subtractMetal } sx={{ color: red[500] }}>
                    <Remove />
                </IconButton>
                </div>
                </Stack>
            </div>
        );
    }
}

export default Metal