import React, { useState } from 'react';
import './App.css';
import { invoke } from '@tauri-apps/api';
import {
  Alert,
  Button, Card,
  CircularProgress,
  Container,
  createTheme,
  Divider,
  List,
  ListItem, ListItemText,
  Modal,
  Snackbar,
  Stack,
  TextField, Typography
} from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import CloseIcon from '@mui/icons-material/Close';
import {Add, Title} from "@mui/icons-material";


// normal console.log doesn't log to terminal but to within tauri
// this just logs via rust
const log = (a: any) => {
  const word: string = a.toString();

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

  const [resultModalOpen, setResultModalOpen] = useState<boolean>(false);

  const [results, setResults] = useState<string[]>([]);
  
  const [loading, setLoading] = useState<boolean>(false);


  const run = async () => {
    setLoading(true);
    setResultModalOpen(true);
    setResults(await invoke("run", {names: names}));
    setLoading(false);
  }

  const addName = () => {
    if(name.length < 4){
      setBadNameNotif({open: true, reason: "Invalid name, too short!"});
    }else if (name.length > 16){
      setBadNameNotif({open: true, reason: "Invalid name, too long!"});
    }else if (!(/^\w+$/i.test(name))){
      setBadNameNotif({open: true, reason: "Invalid name, wrong characters!"});
    }else if(names.includes(name)){
      setBadNameNotif({open: true, reason: "Name already in list!"})
    }
    else{
      setNames(state => [name, ...state as string[]]);
    }
    setName("");
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
    <ThemeProvider theme={theme} >
      <Container className="container" style={{marginTop: 20}}>


        <Stack direction="row" spacing={3}>
          <TextField label="Input a name:" variant='outlined' size='small' onChange={(event) => {setName(event.target.value)}} value={name} />
          <Button variant='outlined' onClick={addName} disabled={name.length === 0}>
            <Add color="inherit"/>
          </Button>
          <Divider orientation='vertical' flexItem/>
          <Button color='success' variant='contained' disabled={names.length === 0} onClick={run}>
            Run
          </Button>
        </Stack>



        <List className="namesList" >
          {
            names.map((n, key) => {
              return (
                <Stack direction="row" className="namesListItem">
                  <ListItem style={{color: "lightgray"}} key={key} divider>
                    {n}
                  </ListItem>
                  <Button variant='text' size='small' color='error' onClick={() => {removeName(key)}}><CloseIcon color="error" fontSize="small"/></Button>
                </Stack>
              )
            })
          }
        </List>


        <Button className='clearButton' variant='contained' color="error" onClick={clearNames} disabled={names.length === 0}>
          Clear
        </Button>


        <Snackbar open={badNameNotif.open} autoHideDuration={2000} onClose={() => {setBadNameNotif({open: false, reason: ""})}}> 
            <Alert severity="error" sx={{ width: '100%' }}>
              {
                badNameNotif.reason
              }
            </Alert>
        </Snackbar>

        <Modal open={resultModalOpen}
               onClose={() => setResultModalOpen(false)}>

          <Card style={{display: "flex", alignItems: "center", justifyContent: "center", width: "100%"}}>
            {
              loading ? <CircularProgress/> :
                <List >
                  <Typography color={"#fff"} fontWeight={"bold"}>Names not taken:</Typography>
                  {
                    results.map(
                        (result, key) => {
                          return (<ListItemText style={{color: "lightgray"}} key={key}>{result}</ListItemText>)
                        }
                    )
                  }
                </List>
            }
          </Card>
        </Modal>
      </Container>
    </ThemeProvider>
  );
}

export default App;
