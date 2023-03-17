import { Button, Card, CardActions, CardContent, TextField } from '@mui/material';
import React, {useState} from 'react';
import { useHistory } from "react-router-dom";

function Login(props) {
  const { onLogin } = props;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submit');
    onLogin(username, password);
    history.push("/");
  }
  const handleCancel = () => {
    history.push("/");
  }
  return (
    <Card sx={{ maxWidth: 300 }}>
        <form onSubmit={(e) => handleSubmit(e)}>
        <CardContent>
            <TextField onChange={ (e) => setUsername(e.target.value) } value={username} autoFocus type="text" name="username" id="username" label="Username"/>
            <TextField onChange={ (e) => setPassword(e.target.value) } value={password} type="password" name="password" id="password" placeholder="Password" label="Password" />
        </CardContent>
        <CardActions>
            <Button disabled={username.length === 0 || password.length === 0} type="submit">Submit</Button> <Button onClick={handleCancel} type="button" color="error">Cancel</Button>
        </CardActions>
        </form>
    </Card>
  );
}

export default Login;