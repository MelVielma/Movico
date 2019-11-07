import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Modal from 'react-bootstrap/Modal';
import LoginForm from './LoginForm';
import CreatePostForm from './CreatePostForm';
import CreateUserForm from './CreateUserForm'

class MyNavbar extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        showLoginModal : false,
        showCreateModal : false,
        showCreateUserModal : false,
        isUserLogged: false
      };

      this.checkIfLogged = this.checkIfLogged.bind(this);
    }

    showLoginModalHandler = (event) =>{
      this.setState({showLoginModal:true});
    }
    hideLoginModalHandler = (event) =>{
      if(this.checkIfLogged()){
        this.forceUpdate();
      }
      this.setState({showLoginModal:false});
    }
    showCreateModalHandler = (event) =>{
      this.setState({showCreateModal: true});
    }
    hideCreateModalHandler = (event) =>{
      this.setState({showCreateModal: false});
    }
    showCreateUserModalHandler = (event) =>{
      this.setState({showCreateUserModal: true});
    }
    hideCreateUserModalHandler = (event) =>{
      this.setState({showCreateUserModal: false});
    }

    handleLogout = (event) =>{
      localStorage.clear(); //Limpiar la sesión del usuario
      this.setState({isUserLogged : false });
      this.forceUpdate(); //Re renderizar la barra
    };

    //Revisar si el usuario ya inicio sesion
    checkIfLogged(){
      let usrToken = localStorage.getItem('user_token');
      let usrId = localStorage.getItem('user_id');
      if(usrToken && usrId){
        this.setState({ isUserLogged: true });
        return true;
      }
    }

    componentDidMount(){
        this.checkIfLogged();
    }

    render() {
        let isUserLogged = this.state.isUserLogged;
        return (
          <>
            {/* Modal para login de usuario */}
            <Modal id="loginModal" show={this.state.showLoginModal} onHide={this.hideLoginModalHandler}>
              <Modal.Header closeButton>
                <Modal.Title>Ingresar</Modal.Title>
              </Modal.Header>
              <LoginForm/>
            </Modal>
            {/* Modal para creación de posts
                TODO: No se deberia mostrar a menos de que este logueado*/}
            <Modal id="createModal" show={this.state.showCreateModal} onHide={this.hideCreateModalHandler}>
              <Modal.Header closeButton>
                <Modal.Title>Crear post</Modal.Title>
              </Modal.Header>
              <CreatePostForm isUserLogged={isUserLogged} />
            </Modal>

            {/* Modal para creacion de usuario */}
            <Modal id="createUserModal" show={this.state.showCreateUserModal} onHide={this.hideCreateUserModalHandler}>
              <Modal.Header closeButton>
                <Modal.Title>Crear Cuenta</Modal.Title>
              </Modal.Header>
              <CreateUserForm/>
            </Modal>

            <Navbar bg="secondary" expand="lg" fixed="top" className="text-uppercase" id="mainNav" >
              <Navbar.Brand href="/">
                <img src={process.env.PUBLIC_URL + '/img/logo_movico.png'} className="d-inline-block align-top" height="30" alt="MOVICO"/>
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                <Nav variant="pills" defaultActiveKey="#home">
                  <Nav.Link className="mx-3 px-3" onClick={this.showCreateModalHandler} href="#1">Crear Publicacion</Nav.Link>
                  <Nav.Link className="mx-3 px-3" href="#about">Acerca</Nav.Link>
                  {!isUserLogged ? (
                    <>
                    <Nav.Link className="mx-3 px-3" onClick={this.showLoginModalHandler} href="#2" >Ingresar</Nav.Link>
                    <Nav.Link className="mx-3 px-3" onClick={this.showCreateUserModalHandler} href="#3">Crear Cuenta</Nav.Link>
                    </>
                  ) : (
                    <Nav.Link className="mx-3 px-3" onClick={this.handleLogout} href="#logout">Log Out</Nav.Link>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Navbar>

          </>
        );
    }
}

export default MyNavbar;
