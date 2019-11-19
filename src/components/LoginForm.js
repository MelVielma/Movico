import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css';
import {Form, Button} from 'react-bootstrap';
import WarningAlert from './WarningAlert';
import SuccessAlert from './SuccessAlert';

class LoginForm extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      email: '',
      password:'',
      user_json:''
    };

    this.createPetition = this.createPetition.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.afterLogin = this.afterLogin.bind(this);
    this.handleLoginError = this.handleLoginError.bind(this);
  }

  createPetition(u_email, u_password){
    var loginPetition = {
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
    ReactDOM.render(<div /> , this.refs.loginFormDiv) //Limpiar el div en donde se pondra el asunto
    var err_html = (
      <SuccessAlert
        title="Bienvenido a Movico"
      />
    )
    ReactDOM.render(err_html , this.refs.loginFormDiv);
    ReactDOM.render(<div /> , this.refs.loginFormForm);
  }

  //Que hacer si hay error en el login
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

  handleSubmit(event){
    event.preventDefault();
    var petition = this.createPetition(this.state.email, this.state.password);
    fetch('/users/login', petition)
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

  handleChange(event){
    if(event.target.type === 'email'){
      this.setState({ email: event.target.value });
    }
    else if (event.target.type === 'password'){
      this.setState({ password: event.target.value });
    }
  }

  render() {
      return (
        <div id="loginFormModal" className="m-4">
            <div ref="loginFormDiv" />
            <Form ref="loginFormForm" id="loginForm" onSubmit={this.handleSubmit}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control required type="email" value={this.state.email} onChange={this.handleChange} placeholder="Ingresar correo" />
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control required type="password" value={this.state.password} onChange={this.handleChange} placeholder="Contraseña" />
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
        </div>
      );
    }

}

export default LoginForm;
