import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { invoke } from '@tauri-apps/api';
import { Alert, BottomNavigation, Button, Container, createTheme, Icon, List, ListItem, Snackbar, TextField } from '@mui/material';
import { Box, palette } from '@mui/system';
import { ThemeProvider } from '@emotion/react';


// normal console.log doesn't log to terminal but to within tauri
// this just logs via rust
const log = (a: any) => {
  const word = a as string;

  invoke("log", {a: word})
}


type BadNameNotif = {
  open: boolean,
  reason: string
}

function App() {
  const [names, setNames] = useState<string[]>([]);
  const [name, setName] = useState<string>("");
  const [badNameNotif, setBadNameNotif] = useState<BadNameNotif>({open: false, reason: ""});


  const addName = () => {
    if(name.length < 4){
      setBadNameNotif({open: true, reason: "Invalid name, name too short!"});
    }else if (name.length > 16){
      setBadNameNotif({open: true, reason: "Invalid name, name too long!"});
    }else if (!(/^\w+$/i.test(name))){
      setBadNameNotif({open: true, reason: "Invalid name, wrong characters!"});
    }else if(names.includes(name)){
      setBadNameNotif({open: true, reason: "Name already in list!"})
    }
    else{
      setNames(state => [name, ...state as string[]]);
    }
  }

  const clearNames = () => {
    setNames([]);
  }

  const removeName = (key: number) => {
    const temp = [...names];

    temp.splice(key, 1);

    setNames(temp);
  }

  const theme = createTheme({
    palette: {
      mode: "dark"
    }
  })

  return (
    <ThemeProvider theme={theme}>
      <Box textAlign="center" className="container">
        <TextField label="Input a name:" variant='standard' onChange={(event) => {setName(event.target.value)}} />
        <Button variant='text' onClick={addName} >
          add
        </Button>
      </Box>
      <Box display="flex" alignItems="center" flexDirection="column">
        <List className="namesList">
          {
            names.map((n, key) => {
              return (
                <ListItem className="namesListItem" key={key}>
                  {n}
                  <Button style={{margin: 10}} variant='outlined' size='small' color='error' onClick={() => {removeName(key)}}>Remove</Button>
                </ListItem>
              )
            })
          }
        </List>
        <Button className='clearButton' variant='contained' color="error" onClick={clearNames} disabled={names.length === 0}>
          Clear
        </Button>
      </Box>

      <Snackbar open={badNameNotif.open} autoHideDuration={2000} onClose={() => {setBadNameNotif({open: false, reason: ""})}}> 
          <Alert severity="error" sx={{ width: '100%' }}>
            {
              badNameNotif.reason
            }
          </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;
