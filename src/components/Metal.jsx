import React from 'react';
import Avatar from '@mui/material/Avatar';
import { blue, red } from '@mui/material/colors';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { Add, Remove } from '@mui/icons-material';
import Typography from '@mui/material/Typography';

const Metal = (props) => {
    const { country, add, subtract, color, metal, metalName } = props;
    return (
        <div className="metal">
            <Stack direction="row" justifyContent="space-between">
                <div>
                    <Stack direction="row" justifyContent="space-evenly" spacing={2}>
                        { 
                            ( metal.page_value !== metal.saved_value) ?
                            <span className="delta">
                                <Stack direction="row" justifyContent="space-evenly" spacing={2}>
                                    <Avatar sx={{ bgcolor: color }}>{metal.page_value}</Avatar>
                                    <Typography>
                                        {metalName} Medals
                                    </Typography>
                                </Stack>
                            </span>
                                    
                            :
                            <span>
                                <Stack direction="row" justifyContent="space-evenly" spacing={2}>
                                    <Avatar sx={{ bgcolor: color }}>{metal.page_value}</Avatar>
                                    <Typography>
                                        {metalName} Medals
                                    </Typography>
                                </Stack>
                            </span>
                        }
                    </Stack>
                </div>
                <div className="buttons">
                    <IconButton aria-label="delete" onClick={ () => add(country.id, metalName.toLowerCase()) } sx={{ color: blue[500] }}>
                        <Add />
                    </IconButton>
                    <IconButton disabled={metal.page_value === 0 ? true : false} aria-label="delete" onClick={ () => subtract(country.id, metalName.toLowerCase()) } sx={{ color: red[500] }}>
                        <Remove />
                    </IconButton>
                </div>
            </Stack>
        </div>
    );
}

export default Metal