import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css';
import {Jumbotron, Button, Spinner} from 'react-bootstrap';
import SuccessAlert from './SuccessAlert';
import CommentsView from './MyCommentDeck';
import Modal from 'react-bootstrap/Modal';
import { Redirect}  from 'react-router';
import {Animated} from "react-animated-css";


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
      isDeletingPub: false,
      afterElimPub: false,
      displayAnimation: false
    };
    this.refPubTitle = React.createRef();
    this.refPubBusiness = React.createRef();
    this.refPubAuthor = React.createRef();
    this.refPubText = React.createRef();
    this.refPubDate = React.createRef();
    this.refImgSrc = React.createRef();
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
    let fetch_url = "https://movico.herokuapp.com/publications/"+ this.state.pubId;
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
    let fetch_url = "https://movico.herokuapp.com/publications/"+ this.state.pubId;
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
    let fetch_url = "https://movico.herokuapp.com/publications/" + this.state.pubId;
    fetch(fetch_url, delPubFromServer(this.state.userTypee))
      .then(() => this.setState({isDeletingPub: false}))
      .then(() => this.displayMessage("Se eliminó la Publicación"))
      .then(() => this.setState({displayAnimation: false}))
      .then(() => this.setState({afterElimPub: true}))
      .catch(err => this.displayMessage(err))
  }

  handleCambiosPub(event) {
    let fetch_url = "https://movico.herokuapp.com/publications/"+ this.state.pubId;
    let dateRegEx = /(\d+)\/(\d+)\/(\d+)/;
    let dateTemp = dateRegEx.exec(this.refPubDate.current.textContent);
    let dateDay = 0;
    let dateMonth = 0;
    let dateYear = 0;
    let dateString = new Date();

    try {
    dateDay = parseInt(dateTemp[1]);
    dateMonth = parseInt(dateTemp[2])-1;
    dateYear = parseInt(dateTemp[3]);
    dateString = new Date(dateYear, dateMonth, dateDay);
    }
    catch(err) {
      this.displayMessage("Fecha ingresada inválida.")
      return;
    }
    let jsonContent = {
      'typee': this.state.userTypee,
      'title': this.refPubTitle.current.textContent,
      'business_name': this.refPubBusiness.current.textContent,
      'author': this.refPubAuthor.current.textContent,
      'text': this.refPubText.current.textContent,
      'media': this.refImgSrc.current.textContent,
      'date': dateString,
      'lastModified': new Date()
    }
    fetch(fetch_url, updateInfoFromServer(jsonContent))
      .then(id => (id.status === 200) ? this.displayMessage("Se editó la publicación de manera exitosa.") : this.displayMessage("Se produjo un error al tratar de hacer la edición."))
      .then(this.updateIsEditable())
      .catch(err => this.displayMessage(err))
  }

  updateIsEditable(event){
    if (!(this.state.isEditable === true)) {
      this.refPubAuthor.current.classList.add('editable-text');
      this.refPubTitle.current.classList.add('editable-text');
      this.refPubText.current.classList.add('editable-text');
      this.refPubBusiness.current.classList.add('editable-text');
      this.refPubDate.current.classList.add('editable-text');
    }
    else {
      this.refPubAuthor.current.classList.remove('editable-text');
      this.refPubTitle.current.classList.remove('editable-text');
      this.refPubText.current.classList.remove('editable-text');
      this.refPubBusiness.current.classList.remove('editable-text');
      this.refPubDate.current.classList.remove('editable-text');
    }
    this.state.isEditable = !this.state.isEditable;

    this.afterGet();
  }

  getPublicationInfo(event){
    let fetch_url = "https://movico.herokuapp.com/publications/" + this.state.pubId;
    fetch(fetch_url, getInfoFromServer)
      .then(response => response.json())
      .then(state => this.setState({publication: state}))
      .then(() => this.setState({publicationStatus: this.state.publication[0].status}))
      .then(() => this.afterGet())
      .then(() => this.setState({displayAnimation: true}))
      .catch(err => this.displayMessage(err))
  }

  afterGet(event){
    var container = this.refs.putSinglePubHere;
    var myPublication = this.state.publication[0];
    let isUserLogged = undefined;
    let isAdmin = this.state.userTypee === 'admin';
    let isPublicationEnable = this.state.publicationStatus === "Enable";
    let isEditable = this.state.isEditable
    if (localStorage.getItem('user_id') != null) {
      isUserLogged = true;
    }

    //Generar ligas de a las etiquetas
    myPublication.tags = myPublication.tags.map(item => (
      <a target="_blank" href={`/etiquetas/${item}`} > {item} </a>
    ));

    let singlePublicationHtml = (
      <Jumbotron className="whiteColorBackground col-md-9 py-3 mb-4 justify-content-center">
        <>
        <div className="row col-11 m-0 textJumbo justify-content-center">
          <h1 className="centerText" ref={this.refPubTitle} contentEditable={this.state.isEditable}>{myPublication.title} </h1>
        </div>
        <div className="row col-11 m-0 textJumbo justify-content-center">
          <h5 className="centerText">
            Realizado por <span ref={this.refPubAuthor} contentEditable={this.state.isEditable}>{myPublication.author} </span>
            el <span ref={this.refPubDate} contentEditable={this.state.isEditable}>{new Date(myPublication.date).toLocaleDateString()} </span>
            para la empresa <span ref={this.refPubBusiness} contentEditable={this.state.isEditable}>{myPublication.business_name}</span>
          </h5>
        </div>
        <div className="row col-11 m-0 textJumbo justify-content-center">
          <h5 className="centerText text-muted">
            Etiquetas: {myPublication.tags}
          </h5>
        </div>
        <div className="row col-11 m-0 justify-content-center">
          <div className="row justify-content-center">
            <img src={myPublication.media} alt={myPublication.title} className="responsive-image mt-3" />
          </div>
          {isEditable ?
            (
              <div className="row col-11 justify-content-center">
                <p className="textJumbo editable-text">Link: <span ref={this.refImgSrc} contentEditable={this.state.isEditable}>{myPublication.media}</span></p>
              </div>
              ):
            <>
            </>
          }
          <div className="row col-11 m-0 textJumbo justify-content-center">
            <h6 className="textJumbo centerText" ref={this.refPubText} contentEditable={this.state.isEditable}> {myPublication.text[0]} </h6>
          </div>
        </div>
        </>
        { (isUserLogged && isAdmin) ? (
           <>
           <div className="row justify-content-center">
          {isPublicationEnable ?
            (
              <Button className="btnOpcionesAdmin m-1 p-3 col-11 col-lg-3" id="btnDeshabilitar" onClick={this.handleDeshabilitarPub}>Deshabilitar Publicación</Button>
            ):(
              <Button className="btnOpcionesAdmin m-1 p-3 col-11 col-lg-3" id="btnHabilitar" onClick={this.handleHabilitarPub}>Habilitar Publicación</Button>
            )
          }
          {isEditable? (
              <Button className="btnOpcionesAdmin m-1 p-3 col-11 col-lg-3" id="btnGuardarCambios" variant="info" onClick={this.handleCambiosPub}>Guardar Cambios</Button>
            ):(
              <Button className="btnOpcionesAdmin m-1 p-3 col-11 col-lg-3" id="btnHacerCambios" variant="info" onClick={this.updateIsEditable}>Modificar Publicación</Button>
            )

          }
          <Button className="btnOpcionesAdmin m-1 p-3 col-11 col-lg-3" id="btnEliminar" onClick={() => this.confirmEliminacionPub()}>Eliminar Publicación</Button>
          </div>
          </>
          ):(
          <>
          </>
          )}
      </Jumbotron>
      );
    ReactDOM.render(singlePublicationHtml, container);
    this.forceUpdate()
  }

  getUserTypee(event){
    let userId = localStorage.getItem('user_id');
    if (userId != null) {
      let fetch_url = "https://movico.herokuapp.com/users/" + userId;
      fetch(fetch_url, getInfoFromServer)
        .then(response => response.json(), err => this.displayMessage(err))
        .then(state => this.setState({userTypee: state.typee}), err => this.displayMessage(err))
        .catch(err => this.displayMessage(err))
    }
    return this.state.userTypee
  }

  componentDidMount() {
    document.body.classList.add("whiteColorBackground")
		this.getPublicationInfo();
    this.getUserTypee();
	}

  render() {
      if(this.state.afterElimPub === true) {
        return <Redirect to="/" />
      }

      //Checar si esto jala
      let comments = this.state.publication[0];
      let isUserLogged = (localStorage.getItem('user_id') != null);
      let userTypee = this.state.userTypee;
      let eliminarPub = this.state.isDeletingPub;
      return (
        <>
        <div>
          <Modal ref="displayMessageModal" show={this.state.showMessageModal} onHide={this.hideMessageModalHandler}>
            <Modal.Header closeButton>
              <Modal.Title>{this.state.message}</Modal.Title>
            </Modal.Header>
            { eliminarPub? (
            <>
            <Modal.Body>
            <div className="row justify-content-around">
              <Button className="col-md-5 m-3 p-3" id="btnCancelar" variant="primary" onClick={this.hideMessageModalHandler}>Cancelar</Button>
              <Button className="col-md-5 m-3 p-3" id="btnEliminar" variant="danger" onClick={this.handleEliminarPub}>Eliminar Publicación</Button>
            </div>
            </Modal.Body>
            </>
            ) : (
            <>
            </>
            )
            }
          </Modal>
        </div>
            <Animated animationIn="fadeIn" animationOut="fadeOut" isVisible={this.state.displayAnimation}>
              <div className="whiteColorBackground row col-md-12 ml-0 mr-0 justify-content-center" id="SinglePublicationView" ref="putSinglePubHere">
                  <Spinner animation="grow" variant="light" />
              </div>
            </Animated>
            <CommentsView listComments={comments} isUserLogged={isUserLogged} userTypee={this.state.userTypee}/>

          </>
      )
    }
}

export default SinglePublicationView;
