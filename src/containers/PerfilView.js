import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import MyNavbar from '../components/MyNavbar';
import Perfil from '../components/Perfil';
import '../index.css';
import '../App.css';

class PerfilView extends React.Component{
  render(){
    return(
      <>
        <div className="App">
          <Perfil />
        </div>
      </>
    );
  }
}

export default PerfilView;
