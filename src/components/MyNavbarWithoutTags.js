import React from 'react';
import LoginForm from './LoginForm';
import CreatePostForm from './CreatePostForm';
import CreateUserForm from './CreateUserForm';
import About from './About';
import {Redirect} from 'react-router';
import {Form, FormControl, Button, Navbar, Nav, Modal, NavDropdown} from 'react-bootstrap';
import '../index.css';


class MyNavbarWithoutTags extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        showLoginModal : false,
        showCreateModal : false,
        showCreateUserModal : false,
        isUserLogged: false,
        showAboutModal: false
      };

      this.checkIfLogged = this.checkIfLogged.bind(this);
      this.refAbout = React.createRef();
      this.refCreate = React.createRef();
      this.refCreateUser = React.createRef();
      this.refLogin = React.createRef();
    }

    showLoginModalHandler = (event) =>{
      this.setState({showLoginModal:true});
    }
    hideLoginModalHandler = (event) =>{
      if(this.checkIfLogged()){
        //this.forceUpdate();
        window.location.reload();
      }
      this.refLogin.current.classList.remove('active');
      this.setState({showLoginModal:false});
    }
    showCreateModalHandler = (event) =>{
      this.setState({showCreateModal: true});
    }
    hideCreateModalHandler = (event) =>{
      this.refCreate.current.classList.remove('active');
      this.setState({showCreateModal: false});
    }
    showCreateUserModalHandler = (event) =>{
      this.setState({showCreateUserModal: true});
    }
    hideCreateUserModalHandler = (event) =>{
      if(this.checkIfLogged()){
        //this.forceUpdate();
        window.location.reload();
      }
      this.refCreateUser.current.classList.remove('active');
      this.setState({showCreateUserModal: false});
    }

    showAboutModalHandler = (event) =>{
      this.setState({showAboutModal: true});
    }
    hideAboutModalHandler = (event) =>{
      this.refAbout.current.classList.remove('active');
      this.setState({showAboutModal: false});
    }

    handleLogout = (event) =>{
      localStorage.clear(); //Limpiar la sesión del usuario
      this.setState({isUserLogged : false });
      //this.forceUpdate(); //Re renderizar la barra
      window.location.reload();
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

            {/* Modal para mostrar el About */}
            <Modal id="aboutModal" show={this.state.showAboutModal} onHide={this.hideAboutModalHandler}>
              <Modal.Header closeButton>
                <Modal.Title>About</Modal.Title>
              </Modal.Header>
              <About/>
            </Modal>


            <Navbar expand="lg" fixed="top" className="text-uppercase navbar-custom" id="mainNav" >
              <Navbar.Brand href="/">
                <img src={process.env.PUBLIC_URL + '/img/logo_movico.png'} className="d-inline-block align-top" height="30" alt="MOVICO"/>
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                <Nav variant="pills" defaultActiveKey="#home">
                  <Nav.Link ref={this.refCreate} className="mx-3 px-3" onClick={this.showCreateModalHandler} href="#1">Crear Publicacion</Nav.Link>
                  <Nav.Link ref={this.refAbout} className="mx-3 px-3" onClick={this.showAboutModalHandler} href='#4'>Acerca</Nav.Link>
                  {!isUserLogged ? (
                    <>
                    <Nav.Link ref={this.refLogin} className="mx-3 px-3" onClick={this.showLoginModalHandler} href="#2" >Ingresar</Nav.Link>
                    <Nav.Link ref={this.refCreateUser} className="mx-3 px-3" onClick={this.showCreateUserModalHandler} href="#3">Crear Cuenta</Nav.Link>
                    </>
                  ) : (
                    <NavDropdown alignRight title="Configuración">
                      <NavDropdown.Item href="/perfil">Perfil</NavDropdown.Item>
                      <NavDropdown.Item onClick={this.handleLogout} href="/">Cerrar sesión</NavDropdown.Item>
                    </NavDropdown>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Navbar>

          </>
        );
    }
}
//<Nav.Link className="mx-3 px-3" onClick={this.handleLogout} href="#logout">Log Out</Nav.Link>
//<img src={process.env.PUBLIC_URL + '/img/user.png'} className="d-inline-block align-top" height="30" alt="Settings"/>
export default MyNavbarWithoutTags;
