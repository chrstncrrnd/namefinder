import React from 'react';
import logo from './logo.svg';
import './App.css';
import { invoke } from '@tauri-apps/api';
import { Button, Container } from '@mui/material';

const onPressButton = () => {
  invoke("first_command");
}

function App() {
  return (
    <Container className="centered">
      <Button variant='outlined' onClick={onPressButton} >
        Hello, world!
      </Button>
    </Container>
  );
}

export default App;
