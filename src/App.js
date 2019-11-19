import React from 'react';
import Routes from './Routes';
import MyNavbar from './components/MyNavbar';
import './App.css';

function App() {
  return (
    <>
      <div id="NavigationBar">
        <MyNavbar />
      </div>
      <Routes />
    </>
  );
}

export default App;
