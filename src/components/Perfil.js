import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css';
import {Jumbotron, Card, Button, Modal, Spinner} from 'react-bootstrap';
import {Animated} from "react-animated-css";
import { Redirect}  from 'react-router';


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
      displayAnimation: false
    };
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
    let fetch_url = "/users/" + this.state.usrId;
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
    let fetch_url = "/publicationsByUser/" + this.state.usrId;
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

  afterGet(event){
    var container = this.refs.putPerfilHere;
    var userToView = this.state.userInfo;

    let singlePublicationHtml = (
      <>
      <div className="row pl-2 pr-2 pt-4 m-3 table-row col-12">
        <h4 className="col-12 col-md-3 "><b>Nombre</b></h4>
        <h4 className="col-12 col-md-9">{userToView.name}</h4>
      </div> 
      <div className="row table-row pl-2 pr-2 pt-4 mb-3 col-12">
        <h4 className="col-12 col-md-3"> <b>Tipo</b> </h4>{ userToView.typee === "userOnly" ? (
          <h4 className="col-12 col-md-9">Usuario regular</h4>
        ) : (
          <h4 className="col-12 col-md-9">Usuario Administrador</h4>
        )}
      </div> 
      <div className="row table-row pl-2 pr-2 pt-4 mb-3 col-12">
        <h4 className="col-12 col-md-3"> <b> Correo </b></h4>
        <h4 className="col-12 col-md-9"> {userToView.email} </h4>
      </div> 
      <div className="row table-row last-row pl-2 pr-2 pt-4 pb-3 mb-3 col-12">
        <h4 className="col-12 col-md-3"> <b> Acerca de </b></h4>
        <h4 className="col-12 col-md-9"> {userToView.about} </h4>
      </div> 
        <Button variant="danger" size="sm" className="p-3 float-right" onClick={() => this.confirmElim()}><p className="m-0"><b>Eliminar cuenta</b></p></Button>
      </>
    )
    //Maybe agregar el editar el perfil, no estaba dentro de lo planeado al parecer
    //<Button variant="primary" size="sm" className="float-right">Editar información </Button>
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
          <h3 className="text-primary centerText"> ¡No se ha creado ninguna publicación! </h3>
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
    let patch_url = '/users/disable';
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
        <Card className="indexMiniCard col-md-5 mx-2 justify-content-center">
          <>
          {bStatus ? (
            
            <a href={new_href}>
             <Card.Img className="reframe index-fluid mt-3" variant="top" src={card.media} alt={card.title} onClick={() => this.updateAnimationStatus()} />
            </a>
          ):
          (
			     <Card.Img className="reframe index-fluid mt-3" variant="top" src={card.media} alt={card.title} />
			    )
        }
          </>
          <>
          <Card.Body>  
            <Card.Title>{card.title}</Card.Title>
			      <Card.Subtitle className="mb-2 text-muted">{card.author}</Card.Subtitle>
			      <Card.Text>
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
			    </>
          <Card.Footer>
			      <small className="text-muted">Fecha de publicación: {card.date}</small>
			    </Card.Footer>
			  </Card>
        </>
		)
		return new_html
  }

  componentDidMount() {
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
              Seguro de deshabilitar la cuenta? las publicaciones seguirán siendo
              accesibles, sin embargo ya no se podrá acceder a la cuenta.
              </p>
            <div className="row justify-content-around">
              <Button variant="primary" size="sm" onClick={this.hideElimModal} className="col-md-5 m-3 p-3"><b>Cancelar</b></Button>
              <Button variant="danger" size="sm" className="col-md-5 m-3 p-3" onClick={this.elimCuenta}><b>Confirmar eliminación</b></Button>
            </div>
            </Modal.Body>
          </Modal>
          <Animated animationIn="fadeIn" animationOut="fadeOut" isVisible={this.state.displayAnimation}>
            <div className="row mx-auto mt-5">
               <div className="col-11 col-md-10 col-lg-6 col-xl-5 mx-auto" id="PerfilView">
                <Jumbotron className="py-4 clearfix ">
                  <h2 className="centerText">Información de Perfil</h2>
                  <div className="row justify-content-around" id="PerfilView" ref="putPerfilHere">
                    <Spinner animation="grow" variant="dark" />
                  </div>
                </Jumbotron>
              </div>
              <div className="col-11 col-md-10 col-lg-6 col-xl-5 mx-auto" id="PerfilPubs">
                <Jumbotron className="py-4">
                  <h2 className="centerText">Publicaciones del perfil</h2>
                  <div className="row justify-content-around m-0" ref="putPubsHere">
                    <Spinner animation="grow" variant="dark" />
                  </div>
                </Jumbotron>
              </div>
            </div>
          </Animated>
        </>
      );
    }

}

export default Perfil;
