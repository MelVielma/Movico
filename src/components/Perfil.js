import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css';
import {Jumbotron, Card, Button, Modal, Spinner} from 'react-bootstrap';
import {Animated} from "react-animated-css";
import { Redirect}  from 'react-router';


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

class Perfil extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      userInfo: '',
      userPubs:'',
      usrId: localStorage.getItem('user_id'), //Obtener id del usuario logueado
      userToken: localStorage.getItem('user_token'),
      showElimModal : false,
      afterElimCuenta : false,
      displayAnimation: false,
      isEditable: false,
      message: '',
      showMessageModal: false
    };
    this.refName = React.createRef();
    this.refAbout = React.createRef();
    this.refNameTag = React.createRef();
    this.refAboutTag = React.createRef();

    this.getUserInfo = this.getUserInfo.bind(this);
    this.getUserPubs = this.getUserPubs.bind(this);
    this.afterGet = this.afterGet.bind(this);
    this.afterPubsGet = this.afterPubsGet.bind(this);
    this.createPetition = this.createPetition.bind(this);
    this.createElimPetition = this.createElimPetition.bind(this);
    this.createPubCard = this.createPubCard.bind(this);
    this.hideElimModal = this.hideElimModal.bind(this);
    this.confirmElim = this.confirmElim.bind(this);
    this.elimCuenta = this.elimCuenta.bind(this);
    this.afterElimCuenta = this.afterElimCuenta.bind(this);
    this.editarPerfil = this.editarPerfil.bind(this);
    this.updateIsEditable = this.updateIsEditable.bind(this);
    this.displayMessage = this.displayMessage.bind(this);
  }

  hideElimModal = (event) =>{
    this.state.showElimModal = false;
    this.forceUpdate();
  }

  confirmElim(event){
    console.log("entro chido")
    this.setState({showElimModal: true});
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

  getUserInfo(event){
    let fetch_url = "https://movico.herokuapp.com/users/" + this.state.usrId;
    let petition = this.createPetition();
    console.log("url: ", fetch_url)
    console.log("petition: ", petition)
    fetch(fetch_url, petition)
      .then(response => response.json())
      .then(state => this.setState({userInfo: state}, () =>
        this.afterGet()
      ))
      .catch(err => console.log(err))
  }

  getUserPubs(event){
    let fetch_url = "https://movico.herokuapp.com/publicationsByUser/" + this.state.usrId;
    let petition = this.createPetition();
    console.log("url: ", fetch_url)
    console.log("petition: ", petition)
    fetch(fetch_url, petition)
      .then(response => response.json())
      .then(state => this.setState({userPubs: state}, () =>
        this.afterPubsGet()
      ))
      .then(this.setState({displayAnimation: true}))
      .catch(err => console.log(err))
  }

  editarPerfil(event) {
    let fetch_url = "https://movico.herokuapp.com/users/update";
    let jsonContent = {
      'name': this.refName.current.textContent,
      'about': this.refAbout.current.textContent
    }
    fetch(fetch_url, updateInfoFromServer(jsonContent))
      .then(id => (id.status === 200) ? this.displayMessage("Se editó la información de manera exitosa.") : this.displayMessage("Se produjo un error al tratar de hacer la edición."))
      .then(this.updateIsEditable())
      .catch(err => this.displayMessage(err))
  }

  updateIsEditable(event) {
    let nameClass = 'editable-perfil'
    if (!(this.state.isEditable === true)) {
      this.refName.current.classList.remove('perfil-row');
      this.refAbout.current.classList.remove('perfil-row');
      this.refName.current.classList.add(nameClass);
      this.refAbout.current.classList.add(nameClass);
      this.refNameTag.current.classList.remove('tertiaryColorText');
      this.refAboutTag.current.classList.remove('tertiaryColorText');
      this.refNameTag.current.classList.add('primaryColorText')
      this.refAboutTag.current.classList.add('primaryColorText')
    }
    else {
      this.refName.current.classList.add('perfil-row');
      this.refAbout.current.classList.add('perfil-row');
      this.refName.current.classList.remove(nameClass);
      this.refAbout.current.classList.remove(nameClass);
      this.refNameTag.current.classList.add('tertiaryColorText');
      this.refAboutTag.current.classList.add('tertiaryColorText');
      this.refNameTag.current.classList.remove('primaryColorText')
      this.refAboutTag.current.classList.remove('primaryColorText')
    }
    this.state.isEditable = !this.state.isEditable;

    this.afterGet();
  }

  displayMessage(mensaje) {
    this.setState({message: mensaje});
    this.setState({showMessageModal: true});
  }

  hideMessageModalHandler = (event) =>{
    this.state.showMessageModal = false;
    this.forceUpdate();
  }

  afterGet(event){
    var container = this.refs.putPerfilHere;
    var userToView = this.state.userInfo;

    let singlePublicationHtml = (
      <>
      <div className="col-12 p-2">
        <h1 className="centerText">¡Hola {userToView.name}!</h1>
      </div>
      <div className="col-12 p-2 pb-4">
        <h3 className="centerText">Esta es la información que tenemos registrada de tu cuenta</h3>
      </div>
      <div className="row m-0 p-2 col-lg-4 col-12">
        <div className="col-12">
          <h3 className="centerText"><span className="perfil-row" ref={this.refName} contentEditable={this.state.isEditable}>{userToView.name}</span></h3>
        </div>
        <div className="col-12 perfil-subtitle">
          <h5 ref={this.refNameTag} className="centerText tertiaryColorText"><b>Nombre</b></h5>
        </div>
      </div>
      <div className="row m-0 p-2 col-lg-4 col-12">
        <div className="col-12">
        { userToView.typee === "userOnly" ?
          (
            <h3 className="centerText"><span className="perfil-row">Usuario Regular</span></h3>
          ) :
          (
            <h3 className="centerText"><span className="perfil-row">Usuario Administrador</span></h3>
          )
        }
        </div>
        <div className="col-12 perfil-subtitle">
          <h5 className="centerText tertiaryColorText"><b>Tipo</b></h5>
        </div>
      </div>
      <div className="row m-0 p-2 col-lg-4 col-12">
        <div className="col-12">
          <h3 className="centerText"><span className="perfil-row">{userToView.email}</span></h3>
        </div>
        <div className="col-12 perfil-subtitle">
          <h5 className="centerText tertiaryColorText"><b>Correo</b></h5>
        </div>
      </div>
      <div className="row m-0 p-2 pt-4 pb-4 col-lg-8 col-12">
        <div className="col-12">
          <h4 className="text-center"><span ref={this.refAbout} className="perfil-row" contentEditable={this.state.isEditable}>{userToView.about}</span></h4>
        </div>
        <div className="col-12 perfil-subtitle">
          <h5 ref={this.refAboutTag} className="centerText tertiaryColorText"><b>Acerca de</b></h5>
        </div>
      </div>
      <div className="row m-0 col-12">
      { !(this.state.isEditable) ?
        (
        <div className="row m-0 col-12 justify-content-center p-4 p-lg-2">
          <Button size="sm" className="editPerfil col-11 col-md-6 col-lg-8 col-xl-6 p-3" onClick={() => this.updateIsEditable()}><p className="m-0"><b>Editar</b></p></Button>
        </div>
        ):
        (
        <div className="row m-0 col-12 justify-content-center p-4 p-lg-2">
          <Button  size="sm" className="updatePerfil col-11 col-md-6 col-lg-8 col-xl-6 p-3" onClick={() => this.editarPerfil()}><p className="m-0"><b>Guardar Cambios</b></p></Button>
        </div>
        )
      }
        <div className="row m-0 col-12 justify-content-center p-4 p-lg-2">
          <Button variant="danger" size="sm" className="col-11 col-md-6 col-lg-8 col-xl-6 p-3" onClick={() => this.confirmElim()}><p className="m-0"><b>Eliminar cuenta</b></p></Button>
        </div>
      </div>
      </>
    )
    //Maybe agregar el editar el perfil, no estaba dentro de lo planeado al parecer
    ReactDOM.render(singlePublicationHtml, container);
  }

  afterPubsGet(event){
    //console.log(publicationToDisplay);
    var container = this.refs.putPubsHere;
    const publicationToDisplay = this.state.userPubs;
    var cards = [];
    if(publicationToDisplay.length > 0){
      for(let i=0; i < publicationToDisplay.length; i++){
        let tempHtml = this.createPubCard(publicationToDisplay[i]);
        cards.push(tempHtml);
      }
      ReactDOM.render(cards, container);
    } else {
      let tempHtml = '';
      tempHtml = (
        <div>
          <h3 className="secondaryColorText centerText"> ¡No se ha creado ninguna publicación! </h3>
        </div>
      )
      ReactDOM.render(tempHtml, container);
    }
  }

  createElimPetition(){
    let getPerfilFromServer = {
      method: 'PATCH',
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

  elimCuenta(event){
    let patch_url = 'https://movico.herokuapp.com/users/disable';
    let petition = this.createElimPetition();
    fetch(patch_url, petition)
      .then(response => this.afterElimCuenta())
      .catch(err => console.log(err))
  }

  afterElimCuenta(event){
    console.log("Se deshabilito la cuenta, adios humano...", this.state.userInfo);
    localStorage.clear(); //Limpiar la sesión del usuario
    this.setState({afterElimCuenta: true});
    window.location.reload();
  }

  createPubCard(card){
    let new_html = '';
		let new_href = "/publicacion/" + card.id;
    //console.log(new_href);
    let estatus = card.status;
    let bStatus = estatus === 'Enable';
		new_html = (
			  <>
          {bStatus ? (
            <>
            <Card className="indexMiniCard cardEnabled perfilPage m-3 col-md-5 col-lg-3 justify-content-center">
            <a href={new_href}>
              <Card.Img className="reframe index-fluid mt-3" variant="top" src={card.media} alt={card.title} onClick={() => this.updateAnimationStatus()} />
            </a>
            <a href={new_href}>
             <Card.Body>
              <Card.Title>{card.title}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">{card.author}</Card.Subtitle>
              <Card.Text className="cardTextLimit">
                {card.text}
              </Card.Text>
              <Card.Text>
                <span className="text-muted"> Estatus: </span>
                {card.status}
              </Card.Text>
              <Card.Text>
                <a className="linkToPublication" href={new_href}>Ver mas</a>
              </Card.Text>

            </Card.Body>
            <Card.Footer>
              <small className="text-muted">Fecha de publicación: {new Date(card.date).toLocaleDateString()}</small>
            </Card.Footer>
            </a>
          </Card>
          </>
          ):
          (
			     <>
           <Card className="indexMiniCard perfilPage m-3 col-md-5 col-lg-3 justify-content-center">
           <Card.Img className="reframe index-fluid mt-3" variant="top" src={card.media} alt={card.title} />
            <Card.Body>
              <Card.Title>{card.title}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">{card.author}</Card.Subtitle>
              <Card.Text className="cardTextLimit">
                {card.text}
              </Card.Text>
              <Card.Text>
                <span className="text-muted"> Estatus: </span>
                {card.status}
              </Card.Text>
              {bStatus ? (
               <a className="linkToPublication" href={new_href}>Ver mas</a>
               )
               :
               (
                <> </>
               )
              }
            </Card.Body>
            <Card.Footer>
              <small className="text-muted">Fecha de publicación: {new Date(card.date).toLocaleDateString()}</small>
            </Card.Footer>
          </Card>
          </>
			    )
        }
        </>
		)
		return new_html
  }

  componentDidMount() {
    document.body.classList.add("primaryColorBackground")
		this.getUserInfo();
    this.getUserPubs();
	}

  render() {
      let isLoaded = this.state.displayAnimation;

      if(this.state.afterElimCuenta === true){
        return <Redirect to="/" />
      }

      return (
        <>
          <Modal id="confirmEliminacionModal" show={this.state.showElimModal} onHide={this.hideElimModal}>
              <Modal.Header closeButton>
              <Modal.Title>Deshabilitar cuenta </Modal.Title>
              </Modal.Header>
            <Modal.Body>
                <p>
                ¿Seguro de deshabilitar la cuenta? las publicaciones seguirán siendo
                accesibles, sin embargo ya no se podrá acceder a la cuenta.
                </p>
              <div className="row justify-content-around">
                <Button variant="primary" size="sm" onClick={this.hideElimModal} className="col-md-5 m-3 p-3"><b>Cancelar</b></Button>
                <Button variant="danger" size="sm" className="col-md-5 m-3 p-3" onClick={this.elimCuenta}><b>Confirmar eliminación</b></Button>
              </div>
            </Modal.Body>
          </Modal>
          <Modal ref="displayMessageModal" show={this.state.showMessageModal} onHide={this.hideMessageModalHandler}>
            <Modal.Header closeButton>
              <Modal.Title>{this.state.message}</Modal.Title>
            </Modal.Header>
          </Modal>
          <Animated animationIn="fadeIn" animationOut="fadeOut" isVisible={this.state.displayAnimation}>
            <div className="row m-0 justify-content-center primaryColorBackground">
               <div className="col-12 p-0" id="PerfilView">
                <Jumbotron>
                  <div className="row col-lg-9 justify-content-around mx-auto" id="PerfilView" ref="putPerfilHere">
                    <div className="row col-12 justify-content-center mx-auto">
                      <h2 className="centerText">Información de Perfil</h2>
                    </div>
                    <div className="row col-12 justify-content-center mx-auto">
                      <Spinner animation="grow" variant="dark" />
                    </div>
                  </div>
                </Jumbotron>
              </div>
              <div className="col-12 col-lg-9" id="PerfilPubs">
                <h2 className="centerText white-text pb-3">Publicaciones del perfil</h2>
                <div className="row justify-content-around m-0" ref="putPubsHere">
                  <Spinner animation="grow" variant="dark" />
                </div>
              </div>
            </div>
          </Animated>
        </>
      );
    }

}

export default Perfil;
