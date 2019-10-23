import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

class MyNavbar extends React.Component{
    render() {
        return (
          <Navbar bg="secondary" expand="lg" fixed="top" className="text-uppercase" id="mainNav" >
            <Navbar.Brand href="#home">Movico</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
              <Nav variant="pills" defaultActiveKey="#home">
                <Nav.Link className="mx-3 px-3" href="#home">Publicaciones</Nav.Link>
                <Nav.Link className="mx-3 px-3" href="#about">Acerca</Nav.Link>
                <Nav.Link className="mx-3 px-3" href="#login">Ingresar</Nav.Link>
                <Nav.Link className="mx-3 px-3" href="#logout">Log Out</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        );
    }
}

export default MyNavbar;
