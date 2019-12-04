import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Perfil from '../components/Perfil';
import MyNavbar from '../components/MyNavbar';
import '../index.css';
import '../App.css';

class PerfilView extends React.Component{
  render(){
    return(
      <>
        <div id="NavigationBar">
          <MyNavbar />
        </div>
        <div className="App">
          <Perfil />
        </div>
      </>
    );
  }
}

export default PerfilView;
