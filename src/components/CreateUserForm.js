import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css';
import {Form, Button} from 'react-bootstrap';
import WarningAlert from './WarningAlert';
import SuccessAlert from './SuccessAlert';

class CreateUserForm extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      name: '',
      email: '',
      password:'',
      about: '',
      user_json:''
    };

    this.createUserPetition = this.createUserPetition.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.afterLogin = this.afterLogin.bind(this);
    this.handleCreateUserError = this.handleCreateUserError.bind(this);
    this.createPetition = this.createPetition.bind(this);
    this.executeLogin = this.executeLogin.bind(this);
  }

  createUserPetition(u_name, u_email, u_password, u_about){
    let createUserPetition = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
    		'Content-Type': 'application/json',
    		'Origin': '',
    		'Host': 'http://localhost:3001'
      },
      body: JSON.stringify({
        name: u_name,
        email: u_email,
        password: u_password,
        about: u_about
      })
    }
    return createUserPetition;
  }

  createPetition(u_email, u_password){
    let loginPetition = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Origin': '',
        'Host': 'http://localhost:3001'
      },
      body: JSON.stringify({
        email: u_email,
        password: u_password
      })
    }
    return loginPetition;
  }

  //Que haces despues de haber iniciado sesion
  afterLogin(event){
    console.log(this.state);
    if(!localStorage.getItem('user_token')){
      localStorage.setItem('user_token', this.state.user_json.token);
    }
    if(!localStorage.getItem('user_id')){
      //TODO: Guardarlo de momento, despues se cambiara a que el token jale el id
      localStorage.setItem('user_id', this.state.user_json.user.id);
    }
    ReactDOM.render(<div /> , this.refs.createUserFormDiv) //Limpiar el div en donde se pondra el asunto
    var err_html = (
      <SuccessAlert
        title="Bienvenido a Movico"
      />
    )
    ReactDOM.render(err_html , this.refs.createUserFormDiv);
    ReactDOM.render(<div /> , this.refs.createUserFormForm);
  }

  //Que hacer si hay error en la creación de usuario
  handleCreateUserError(err){
    console.log(err);

    ReactDOM.render(<div /> , this.refs.createUserFormDiv) //Limpiar el div en donde se pondra el asunto
    var err_html = (
      <WarningAlert
        title="Verifica los datos"
        text="Email ya registrado."
      />
    );
    ReactDOM.render(err_html , this.refs.createUserFormDiv)
  }

  handleSubmit(event){
    event.preventDefault();
    var petition = this.createUserPetition(this.state.name, this.state.email, this.state.password, this.state.about);
    fetch('https://movico.herokuapp.com/users', petition)
      .then(function(response){
        if(!response.ok){
          throw Error(response.statusText);
        }
        return response.json();
      })
      .then(state => this.executeLogin())
      .catch(err => this.handleCreateUserError(err));
  }

  executeLogin(){
    var petition = this.createPetition(this.state.email, this.state.password);
    fetch('https://movico.herokuapp.com/users/login', petition)
      .then(function(response){
        if(!response.ok){
          throw Error(response.statusText);
        }
        return response.json();
      })
      .then(state => this.setState({user_json: state}, () =>
        this.afterLogin()))
      .catch(err => this.handleLoginError(err));
  }

  handleLoginError(err){
    console.log(err);

    ReactDOM.render(<div /> , this.refs.loginFormDiv) //Limpiar el div en donde se pondra el asunto
    var err_html = (
      <WarningAlert
        title="Verifica los datos"
        text="Combinación de email y contraseña no coincide, favor de revisar los datos."
      />
    );
    ReactDOM.render(err_html , this.refs.loginFormDiv)
  }

  handleChange(event){
    if(event.target.type === 'email'){
      this.setState({ email: event.target.value });
    }
    else if (event.target.type === 'password'){
      this.setState({ password: event.target.value });
    }
    else if (event.target.type === 'text'){
      if(event.target.id === 'nameUser') {
        this.setState({ name: event.target.value });
      }
      else
      {
        this.setState({ about: event.target.value });
      }
    }
  }

  render() {
      return (
        <div id="createUserFormModal" className="m-4">
            <div ref="createUserFormDiv" />
            <Form ref="createUserFormForm" id="createUserForm" onSubmit={this.handleSubmit}>
              <Form.Group controlId="formBasicName">
                <Form.Label>Name</Form.Label>
                <Form.Control id="nameUser" type="text" value={this.state.name} onChange={this.handleChange} minLength={4} required placeholder="Ingresar nombre" />
              </Form.Group>

              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" value={this.state.email} onChange={this.handleChange} required placeholder="Ingresar correo" />
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" value={this.state.password} onChange={this.handleChange} minLength={8} required placeholder="Contraseña" />
              </Form.Group>

              <Form.Group controlId="formBasicAbout">
                <Form.Label>About</Form.Label>
                <Form.Control id="aboutUser" type="text" value={this.state.about} onChange={this.handleChange} required placeholder="Acerca de ti" />
              </Form.Group>
              <Button className = "btnPostForm" variant="primary" type="submit">
                Submit
              </Button>
            </Form>
        </div>
      );
    }

}

export default CreateUserForm;
