import { Add, Close } from '@mui/icons-material';
import { IconButton, Modal, Box, TextField, Button, Typography } from '@mui/material';
import { blue, red } from '@mui/material/colors';
import React, { useState } from 'react';

const AddCountry = (props) => {
      const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };
      const [open, setOpen] = useState(false);
      const [country, setCountry] = useState('');
      const saveCountry = () => {
        props.onAdd(country);
        handleClose();
      } 
  const handleOpen = () => setOpen(true);
  const handleClose = () => {setOpen(false); setCountry('');}
    return (
        <div>
        <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
            <IconButton onClick={handleClose} sx={{ color: red[500], position: 'absolute', top: 16, right: 16 }}>
                <Close />
            </IconButton>
            <Typography variant="h5">
                Add New Country
            </Typography>
            <hr/>
              <TextField
                id="country"
                name="country"
                defaultValue={ country }
                onChange={ (e) => setCountry(e.target.value) }
                label="Country Name"
                autoFocus
                autoComplete="off" 
                fullWidth/>
              <Button
                disabled={ country.trim().length === 0 } 
                onClick={ saveCountry } 
                sx={{ color: blue[500], top: 10}}>
                Save
              </Button>
            </Box>
            </Modal>
            <IconButton onClick={handleOpen} sx={{ bgcolor: blue[500], position: 'absolute', bottom: 40, right: 40 }} size="large">
                <Add />
            </IconButton>
      </div>
    );
}

export default AddCountry