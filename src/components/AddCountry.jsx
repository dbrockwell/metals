import { Add, Close } from '@mui/icons-material';
import { IconButton, Modal, Box, TextField, Button, Typography } from '@mui/material';
import { blue, red } from '@mui/material/colors';
import React, { Component } from 'react';

class AddCountry extends Component {
    state = {
        country: '',
        open: false,
    }
    toggleForm = () => {
        const { showForm } = this.state;
        this.setState({ showForm : !showForm });
        if (showForm) {
          this.setState({ country: '' });
        }
      }
      handleOpen = () => {
        this.setState({ open: true});
      }
      handleClose = () => {
        this.setState({ open: false});
        this.setState({ country: '' });
      }
    handleChange = (e) => this.setState({ [e.target.name]: e.target.value});
    saveCountry = () => {
        const { country } = this.state;
        this.props.onAdd(country);
        this.handleClose();
      } 
  render() { 
    const { country, open } = this.state;
    return (
        <div>
        <Modal
                open={open}
                onClose={this.handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,}}>
            <IconButton onClick={this.handleClose} sx={{ color: red[500], position: 'absolute', top: 16, right: 16 }}>
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
                onChange={ this.handleChange }
                label="Country Name"
                autoFocus
                autoComplete="off" 
                fullWidth/>
              <Button
                disabled={ country.trim().length === 0 } 
                onClick={ this.saveCountry } 
                sx={{ color: blue[500], top: 10}}>
                Save
              </Button>
            </Box>
            </Modal>
            <IconButton onClick={this.handleOpen} sx={{ bgcolor: blue[500], position: 'absolute', bottom: 40, right: 40 }} size="large">
                <Add />
            </IconButton>
      </div>
    );
  }
}

export default AddCountry