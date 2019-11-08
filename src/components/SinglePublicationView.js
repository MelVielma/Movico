import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css';
import {Jumbotron, Card, Button} from 'react-bootstrap';
import SuccessAlert from './SuccessAlert';
import Modal from 'react-bootstrap/Modal';


var getInfoFromServer = {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Origin': '',
    'Host': 'http://localhost:3001'
  }
}

var updateInfoFromServer = function (updates) {
  return {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Origin': '',
      'Host': 'http://localhost:3001'
    },
    body: JSON.stringify(
      updates
    )
  }
}

// EN EL BACK SE DEBE DE MOVER QUE SAQUE EL TYPEE DEL BODY, NO DE REQ.USER, QUE NO PUEDES HACERLE APPEND EL USER NOMAS PORQUE SI
var delPubFromServer = {
  method: 'DELETE',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Origin': '',
    'Host': 'http://localhost:3001'
  },
  body: JSON.stringify({
      'typee': "admin"
    })
}

class SinglePublicationView extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      pubId: this.props.pubId,
      publication: '',
      userTypee: '',
      isEditable: false,
    };
    this.refPubTitle = React.createRef();
    this.refPubBusiness = React.createRef();
    this.refPubAuthor = React.createRef();
    this.refPubText = React.createRef();
    this.refPubDate = React.createRef();

    this.getPublicationInfo = this.getPublicationInfo.bind(this);
    this.afterGet = this.afterGet.bind(this);
    this.getUserTypee = this.getUserTypee.bind(this);
    this.handleDeshabilitarPub = this.handleDeshabilitarPub.bind(this);
    this.handleHabilitarPub = this.handleHabilitarPub.bind(this);
    this.handleEliminarPub = this.handleEliminarPub.bind(this);
    this.displayMessage = this.displayMessage.bind(this);
    this.handleCambiosPub = this.handleCambiosPub.bind(this);
    this.updateIsEditable = this.updateIsEditable.bind(this);
  }

  displayMessage(message){
    ReactDOM.render(<div />, this.refs.displayMessageModal)
    var err_html = (
        <Modal id="adminPubMod">
          <SuccessAlert
            title={message}
          />
        </Modal>
      )
    ReactDOM.render(err_html, this.refs.displayMessageModal)
  }

  handleDeshabilitarPub(event) {
    let fetch_url = "/publications";
    let jsonContent = {
      'typee': "admin",
      'status': "Disable"
    }
    fetch(fetch_url, updateInfoFromServer(jsonContent))
      .then(() => this.displayMessage("Se deshabilitó la Publicación"))
      .catch(err => this.displayMessage(err))
  }

  handleHabilitarPub(event){
    let fetch_url = "/publications";
    let jsonContent = {
      'typee': "admin",
      'status': "Enable"
    }
    fetch(fetch_url, updateInfoFromServer(jsonContent))
      .then(() => this.displayMessage("Se habilitó la Publicación"))
      .catch(err => this.displayMessage(err))
  }

  handleEliminarPub(event){
    let fetch_url = "/publications/" + this.state.pubId;
    fetch(fetch_url, delPubFromServer)
      .then(() => this.displayMessage("Se eliminó la Publicación"))
      .catch(err => this.displayMessage(err))
  }


  handleCambiosPub(event) {
    //p_title, p_business_name, p_author, p_text, p_media, p_tags, p_date, p_status
    
    //FALTA PROBAR QUE ESTO JALA
    let fetch_url = "/publications";
    let jsonContent = {
      'title': this.refPubTitle.current.textContent,
      'business_name': this.refPubBusiness.current.textContent,
      'author': this.refPubAuthor.current.textContent,
      'text': this.refPubText.current.textContent,
      'date': this.refPubDate.current.textContent
    }
    fetch(fetch_url, updateInfoFromServer(jsonContent))
      .then(() => this.displayMessage("Se modificó la Publicación de manera exitosa"))
      .catch(err => this.displayMessage(err))
    
    this.updateIsEditable();
    this.afterGet();
  }

  updateIsEditable(event){
    console.log("*******updateIsEditable:", this.state.isEditable)
    this.state.isEditable = !this.state.isEditable
    //this.setState({isEditable: !this.state.isEditable});
    console.log("El valor actualizado de updateIsEditable es:", this.state.isEditable)
    this.afterGet();
  }



  getPublicationInfo(event){
    let fetch_url = "/publications/" + this.state.pubId;
    fetch(fetch_url, getInfoFromServer)
      .then(response => response.json())
      .then(state => this.setState({publication: state}, () =>
        this.getUserTypee()));
  }

  afterGet(event){
    this.state.userTypee = "admin"
    
    console.log(this.state.userTypee);
    var container = this.refs.putSinglePubHere;
    var myPublication = this.state.publication[0];
    console.log("Estado after get single publ: ",myPublication);
    let isUserLogged = undefined;
    console.log(localStorage.getItem('user_id')!= null);
    let isAdmin = this.state.userTypee === 'admin';
    let isPublicationEnable = this.state.publication[0].status === "Enable";
    let isEditable = this.state.isEditable
    if (localStorage.getItem('user_id') != null) {
      isUserLogged = true;
    }
    
    console.log("isUserLogged: ", isUserLogged)
    console.log("isAdmin: ", isAdmin)
    console.log("isPublicationEnable: ", isPublicationEnable)

    let singlePublicationHtml = (
      <Jumbotron>
        <>
        <h1 ref={this.refPubTitle} contentEditable={this.state.isEditable}>{myPublication.title} </h1>
        <>
        <h2><i ref={this.refPubAuthor} contentEditable={this.state.isEditable}> Autor: {myPublication.author} </i></h2>
        </>
        <h3 ref={this.refPubBusiness} contentEditable={this.state.isEditable}>Empresa: {myPublication.business_name}</h3>
        <img src={myPublication.media} alt={myPublication.title} height="350" />
        <h5 ref={this.refPubDate} contentEditable={this.state.isEditable}><b>Fecha: </b>{myPublication.date} </h5>
        <h6 ref={this.refPubText} contentEditable={this.state.isEditable}> {myPublication.text[0]} </h6>
        </>
        <div>
          { (isUserLogged && isAdmin) ? (
             <>
            {isPublicationEnable ? 
              (
                <Button id="btnDeshabilitar" variant="warning" onClick={this.handleDeshabilitarPub}>Deshabilitar Publicación</Button>    
              ):(
                <Button id="btnHabilitar" variant="success" onClick={this.handleHabilitarPub}>Habilitar Publicación</Button>
              )
            }
            {isEditable? (
                <Button id="btnGuardarCambios" variant="info" onClick={this.handleCambiosPub}>Guardar Cambios</Button>
              ):(
                <Button id="btnHacerCambios" variant="info" onClick={this.updateIsEditable}>Modificar Publicación</Button>
              )

            }
            <Button id="btnEliminar" variant="danger" onClick={this.handleEliminarPub}>Eliminar Publicación</Button>
            </>
            ):(
            <>
            </>
            )}
        </div>
      </Jumbotron>
      );
    ReactDOM.render(singlePublicationHtml, container);
  }

  getUserTypee(event){
    let userId = localStorage.getItem('user_id');
    console.log(userId)
    if (userId != null) {
      let fetch_url = "/users/" + userId;
      fetch(fetch_url, getInfoFromServer)
        .then(response => response.json())
        .then(state => this.setState({userTypee: state.typee}, () =>
          this.afterGet()));
    }
  }



  componentDidMount() {
		this.getPublicationInfo();
	}

  render() {
      //Checar si esto jala 
      
      return (
        <>
        <div ref="displayMessageModal" />
        <div id="SinglePublicationView" ref="putSinglePubHere">
            <h1> {this.state.pubId} </h1>
        
        </div>
        </>
      )
    }
}

export default SinglePublicationView;
