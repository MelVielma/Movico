import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css';
import {Jumbotron, Button} from 'react-bootstrap';
import SuccessAlert from './SuccessAlert';
import CommentsView from './MyCommentDeck';
import Modal from 'react-bootstrap/Modal';


var getInfoFromServer = {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Origin': '',
    'Host': 'http://localhost:3001',
    'Authorization': `Bearer ${localStorage.getItem('user_token')}`
  }
}

var updateInfoFromServer = function (updates) {

  console.log("updates", updates)
  return {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Origin': '',
      'Host': 'http://localhost:3001',
      'Authorization': `Bearer ${localStorage.getItem('user_token')}`
    },
    body: JSON.stringify(
      updates
    ),

  }
}

var delPubFromServer = function(typee){
  return {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Origin': '',
      'Host': 'http://localhost:3001',
      'Authorization': `Bearer ${localStorage.getItem('user_token')}`
    },
    body: JSON.stringify({
        'typee': typee
    })
  }
}

class SinglePublicationView extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      pubId: this.props.pubId,
      publication: '',
      userTypee: '',
      isEditable: false,
      showMessageModal : false,
      message: '',
      publicationStatus: '',
      listCommentsBool: false,
      isDeletingPub: false
    };
    this.refPubTitle = React.createRef();
    this.refPubBusiness = React.createRef();
    this.refPubAuthor = React.createRef();
    this.refPubText = React.createRef();
    this.refPubDate = React.createRef();
    this.displayMessageModal = React.createRef();



    this.getPublicationInfo = this.getPublicationInfo.bind(this);
    this.afterGet = this.afterGet.bind(this);
    this.getUserTypee = this.getUserTypee.bind(this);
    this.handleDeshabilitarPub = this.handleDeshabilitarPub.bind(this);
    this.handleHabilitarPub = this.handleHabilitarPub.bind(this);
    this.handleEliminarPub = this.handleEliminarPub.bind(this);
    this.displayMessage = this.displayMessage.bind(this);
    this.handleCambiosPub = this.handleCambiosPub.bind(this);
    this.updateIsEditable = this.updateIsEditable.bind(this);
    this.hideMessageModalHandler = this.hideMessageModalHandler.bind(this);
    this.confirmEliminacionPub = this.confirmEliminacionPub.bind(this);
  }

  hideMessageModalHandler = (event) =>{
    this.state.showMessageModal = false;
    this.forceUpdate();
  }

  confirmEliminacionPub() {
    this.state.isDeletingPub = true;
    this.displayMessage("Se perderá toda la información de la publicación")
  }

  displayMessage(message){
    console.log("Se despliega el mensaje:", message)
    this.state.message = message;
    this.state.showMessageModal = true;
    try {
      this.afterGet();
    }
    catch(err) {
      console.log("Publicación no accesible");
      /*
      let err_html = (
          <h1>
            err
          </h1>
        )
      ReactDOM.render(err_html , this.refs.displayMessageModal);
      */
    }
  }

  handleDeshabilitarPub(event) {
    this.state.publicationStatus = 'Disable';
    let fetch_url = "/publications/"+ this.state.pubId;
    let jsonContent = {
      'typee': this.state.userTypee,
      'status': this.state.publicationStatus
    }
    fetch(fetch_url, updateInfoFromServer(jsonContent))
      .then(() => this.displayMessage("Se deshabilitó la Publicación"))
      .then(() => this.setState({publicationStatus: "Disable"}))
      .then(() => this.afterGet(), err => this.displayMessage(err))
      .catch(err => this.displayMessage(err))
  }

  handleHabilitarPub(event){
    this.state.publicationStatus = 'Enable';
    let fetch_url = "/publications/"+ this.state.pubId;
    let jsonContent = {
      'typee': this.state.userTypee,
      'status': this.state.publicationStatus
    }
    fetch(fetch_url, updateInfoFromServer(jsonContent))
      .then(() => this.displayMessage("Se habilitó la Publicación"))
      .then(() => this.setState({publicationStatus: "Enable"}))
      .then(() => this.afterGet(), err => this.displayMessage(err))
      .catch(err => this.displayMessage(err))
  }

  handleEliminarPub(event){
    console.log("handleEliminarPub", "prueba de que esto no siempre se imprime")
    let fetch_url = "/publications/" + this.state.pubId;

    fetch(fetch_url, delPubFromServer(this.state.userTypee))
      .then(() => this.setState({isDeletingPub: false}))
      .then(() => this.displayMessage("Se eliminó la Publicación"))
      .catch(err => this.displayMessage(err))
  }

  handleCambiosPub(event) {
    let fetch_url = "/publications/"+ this.state.pubId;
    console.log(fetch_url)
    let jsonContent = {
      'typee': this.state.userTypee,
      'title': this.refPubTitle.current.textContent,
      'business_name': this.refPubBusiness.current.textContent,
      'author': this.refPubAuthor.current.textContent,
      'text': this.refPubText.current.textContent,
      'date': this.refPubDate.current.textContent
    }
    fetch(fetch_url, updateInfoFromServer(jsonContent))
      .then(id => this.displayMessage("Se modificó la Publicación de manera exitosa"))
      .then(this.updateIsEditable())
      .catch(err => this.displayMessage(err))
  }

  updateIsEditable(event){
    console.log("*******updateIsEditable:", this.state.isEditable)
    this.state.isEditable = !this.state.isEditable;
    console.log("El valor actualizado de updateIsEditable es:", this.state.isEditable)
    this.afterGet();
  }

  getPublicationInfo(event){
    let fetch_url = "/publications/" + this.state.pubId;
    fetch(fetch_url, getInfoFromServer)
      .then(response => response.json())
      .then(state => this.setState({publication: state}))
      .then(() => this.setState({publicationStatus: this.state.publication[0].status}))
      .then(() => this.afterGet())
      .catch(err => this.displayMessage(err))
  }

  afterGet(event){
    var container = this.refs.putSinglePubHere;
    var myPublication = this.state.publication[0];
    console.log("Estado after get single publ: ",myPublication);
    let isUserLogged = undefined;
    console.log("this.state.userTypee", this.state.userTypee)
    let isAdmin = this.state.userTypee === 'admin';
    let isPublicationEnable = this.state.publicationStatus === "Enable";
    let isEditable = this.state.isEditable
    if (localStorage.getItem('user_id') != null) {
      isUserLogged = true;
    }

    console.log("isUserLogged: ", isUserLogged)
    console.log("isAdmin: ", isAdmin)
    console.log("isPublicationEnable: ", isPublicationEnable)
    console.log("isEditable", isEditable)

    let singlePublicationHtml = (
      <Jumbotron>
        <>
        <h1 ref={this.refPubTitle} contentEditable={this.state.isEditable}>{myPublication.title} </h1>
        <>
        <h2><i> Autor: <span ref={this.refPubAuthor} contentEditable={this.state.isEditable}>{myPublication.author}</span> </i></h2>
        </>
        <h3>Empresa: <span ref={this.refPubBusiness} contentEditable={this.state.isEditable}>{myPublication.business_name}</span></h3>
        <img src={myPublication.media} alt={myPublication.title} height="350" />
        <h5><b>Fecha: </b><span ref={this.refPubDate} contentEditable={this.state.isEditable}>{myPublication.date}</span> </h5>
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
            <Button id="btnEliminar" variant="danger" onClick={() => this.confirmEliminacionPub()}>Eliminar Publicación</Button>
            </>
            ):(
            <>
            </>
            )}
        </div>
      </Jumbotron>
      );
    ReactDOM.render(singlePublicationHtml, container);
    this.forceUpdate()
  }

  getUserTypee(event){
    let userId = localStorage.getItem('user_id');
    console.log(userId)
    if (userId != null) {
      let fetch_url = "/users/" + userId;
      fetch(fetch_url, getInfoFromServer)
        .then(response => response.json(), err => this.displayMessage(err))
        .then(state => this.setState({userTypee: state.typee}), err => this.displayMessage(err))
        .catch(err => this.displayMessage(err))
    }
    return this.state.userTypee
  }

  componentDidMount() {
		this.getPublicationInfo();
    this.getUserTypee();
	}

  render() {
      //Checar si esto jala
      let comments = this.state.publication[0];
      let isUserLogged = (localStorage.getItem('user_id') != null);
      let userTypee = this.state.userTypee;
      let eliminarPub = this.state.isDeletingPub;
      console.log("render userTypee", userTypee);
      //console.log("isEditable",this.state.isEditable)
      return (
        <>
        <div>
          <Modal ref="displayMessageModal" show={this.state.showMessageModal} onHide={this.hideMessageModalHandler}>
            <Modal.Header closeButton>
              <Modal.Title>{this.state.message}</Modal.Title>
            </Modal.Header>
            { eliminarPub? (
            <Button id="btnEliminar" variant="danger" onClick={this.handleEliminarPub}>Eliminar Publicación</Button>
            ) : (
            <>
            </>
            )
            }
          </Modal>
        </div>
        <div id="SinglePublicationView" ref="putSinglePubHere">
            <h1> {this.state.pubId} </h1>
        </div>
          <CommentsView listComments={comments} isUserLogged={isUserLogged} userTypee={this.state.userTypee}/>
        </>
      )
    }
}

export default SinglePublicationView;
