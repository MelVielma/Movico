import React from 'react';
import LoginForm from './LoginForm';
import CreatePostForm from './CreatePostForm';
import CreateUserForm from './CreateUserForm';
import About from './About';
import {Redirect} from 'react-router';
import {Form, FormControl, Button, Navbar, Nav, Modal, NavDropdown} from 'react-bootstrap';

class MyNavbar extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        showLoginModal : false,
        showCreateModal : false,
        showCreateUserModal : false,
        showAbout: false,
        isUserLogged: false,
        tagsToSearch: '',
        setToSearch: false
      };

      this.checkIfLogged = this.checkIfLogged.bind(this);
    }

    showLoginModalHandler = (event) =>{
      this.setState({showLoginModal:true});
    }
    hideLoginModalHandler = (event) =>{
      if(this.checkIfLogged()){
        //this.forceUpdate();
        window.location.reload();
      }
      this.setState({showLoginModal:false});
    }
    showAboutModalHandler = (event) =>{
      this.setState({showAbout: true});
    }
    hideAboutModalHandler = (event) =>{
      this.setState({showAbout: false});
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
      if(this.checkIfLogged()){
        //this.forceUpdate();
        window.location.reload();
      }
      this.setState({showCreateUserModal: false});
    }

    handleLogout = (event) =>{
      localStorage.clear(); //Limpiar la sesión del usuario
      this.setState({isUserLogged : false });
      //this.forceUpdate(); //Re renderizar la barra
      window.location.reload();
    };

    //Actualizar el valor de las etiquetas a ser buscadas
    handleTagChange = (event) =>{
      this.setState({tagsToSearch : event.target.value});
    }
    handleTagSearch = (event) =>{
      event.preventDefault();
      if(this.state.tagsToSearch !== ''){
        this.setState({setToSearch : true});
      }
    }

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
        if(this.state.setToSearch === true){
          let toUrl = "/etiquetas/" + this.state.tagsToSearch;
          return <Redirect push to={toUrl} />
        }

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
            <Modal id="aboutModal" show={this.state.showAbout} onHide={this.hideAboutModalHandler}>
              <Modal.Header closeButton>
                <Modal.Title>About</Modal.Title>
              </Modal.Header>
              <About/>
            </Modal>

            <Navbar bg="light" expand="lg" fixed="top" className="text-uppercase" id="mainNav" >
              <Navbar.Brand href="/">
                <img src={process.env.PUBLIC_URL + '/img/logo_movico.png'} className="d-inline-block align-top" height="30" alt="MOVICO"/>
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                <Nav variant="pills" defaultActiveKey="#home">
                  <Form inline className="flex-left" onSubmit={this.handleTagSearch}>
                    <FormControl value={this.state.tagsToSearch} onChange={this.handleTagChange} type="text" placeholder="Etiqueta a buscar" size="sm" className="mr-sm-2" />
                    <Button variant="outline-primary" size="sm" onClick={this.handleTagSearch}>Buscar</Button>
                  </Form>
                  <Nav.Link className="mx-3 px-3" onClick={this.showCreateModalHandler} href="#1">Crear Publicacion</Nav.Link>
                  <Nav.Link className="mx-3 px-3" onClick={this.showAboutModalHandler} href='#4'>Acerca</Nav.Link>
                  {!isUserLogged ? (
                    <>
                    <Nav.Link className="mx-3 px-3" onClick={this.showLoginModalHandler} href="#2" >Ingresar</Nav.Link>
                    <Nav.Link className="mx-3 px-3" onClick={this.showCreateUserModalHandler} href="#3">Crear Cuenta</Nav.Link>
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
export default MyNavbar;
