import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css';
import {Jumbotron} from 'react-bootstrap';



class Perfil extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      userInfo: '',
      usrId: localStorage.getItem('user_id'), //Obtener id del usuario logueado
      userToken: localStorage.getItem('user_token')
    };
    this.getUserInfo = this.getUserInfo.bind(this);
    this.afterGet = this.afterGet.bind(this);
    this.afterPubsGet = this.afterPubsGet.bind(this);
    this.createPetition = this.createPetition.bind(this);
  }

  createPetition(){
    let getPerfilFromServer = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Origin': '',
        'Host': 'http://localhost:3001',
        Authorization: 'Bearer ' + this.state.userToken,
      }
    }
    return getPerfilFromServer;
  }

  getUserInfo(event, getPerfil){
    let fetch_url = getPerfil ? "/users/" : "/publicationsByUser/";
    fetch_url = fetch_url + this.state.usrId;
    let petition = this.createPetition();
    console.log("url: ", fetch_url)
    console.log("petition: ", petition)
    fetch(fetch_url, petition)
      .then(response => response.json())
      .then(state => this.setState({userInfo: state}, () =>
        {if(getPerfil){
          this.afterGet()
        } else {
          this.afterPubsGet()
        }}
      ));
  }

//MEjor hacer dos gets pa que te la pelas tanto amigo
  afterGet(event){
    var container = this.refs.putPerfilHere;
    var userToView = this.state.userInfo;

    let singlePublicationHtml = (
      <Jumbotron>
        <h1> Perfil de: {userToView.name}  </h1>
        <h3> <b> Tipo: </b> { userToView.typee == "userOnly" ? (
          "Usuario regular"
        ) : (
          "Usuario Administrador"
        )} </h3>
        <h3> <b> Correo: </b> {userToView.email} </h3>
        <h4> <b> Acerca de: </b> {userToView.about} </h4>
      </Jumbotron>
    )
    ReactDOM.render(singlePublicationHtml, container);
  }

  afterPubsGet(event){
    var container = this.refs.putPubsHere;
    var publicationToDisplay = this.state.userInfo;
    console.log(publicationToDisplay);
  }

  componentDidMount() {
		this.getUserInfo(true);
    this.getUserInfo(false);
	}

  render() {
      return (
        <>
          <div className="col-6 mt-5 mx-auto" id="PerfilView" ref="putPerfilHere">
          </div>
          <div className="col-6 mt-5 mx-auto" id="PerfilPubs" ref="putPubsHere">
          </div>
        </>
      );
    }

}

export default Perfil;
