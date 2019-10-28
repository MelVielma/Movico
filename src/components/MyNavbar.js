import React from 'react';
import ReactDOM from 'react-dom';
import { useState, render } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Modal from 'react-bootstrap/Modal';
import LoginForm from './LoginForm';

class MyNavbar extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        showModal: false
      };
    }

    showModalHandler = (event) =>{
      this.setState({showModal:true});
    }

    hideModalHandler = (event) =>{
      this.setState({showModal:false});
    }

    render() {
        return (
          <>
            <Modal id="loginModal" show={this.state.showModal} onHide={this.hideModalHandler}>
              <Modal.Header closeButton>
                <Modal.Title>Login</Modal.Title>
              </Modal.Header>
              <LoginForm/>
            </Modal>

            <Navbar bg="secondary" expand="lg" fixed="top" className="text-uppercase" id="mainNav" >
              <Navbar.Brand href="/">Movico</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                <Nav variant="pills" defaultActiveKey="#home">
                  <Nav.Link className="mx-3 px-3" href="#home">Publicaciones</Nav.Link>
                  <Nav.Link className="mx-3 px-3" href="#about">Acerca</Nav.Link>
                  {/* TODO: mejor no desplegar el login cuando ya este logueado */}
                  <Nav.Link className="mx-3 px-3" onClick={this.showModalHandler} href="#" >Ingresar</Nav.Link>
                  <Nav.Link className="mx-3 px-3" href="#logout">Log Out</Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Navbar>

          </>
        );
    }
}

export default MyNavbar;
