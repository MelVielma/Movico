import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css';
import {Jumbotron, Card} from 'react-bootstrap';



class Perfil extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      userInfo: '',
      userPubs:'',
      usrId: localStorage.getItem('user_id'), //Obtener id del usuario logueado
      userToken: localStorage.getItem('user_token')
    };
    this.getUserInfo = this.getUserInfo.bind(this);
    this.getUserPubs = this.getUserPubs.bind(this);
    this.afterGet = this.afterGet.bind(this);
    this.afterPubsGet = this.afterPubsGet.bind(this);
    this.createPetition = this.createPetition.bind(this);
    this.createPubCard = this.createPubCard.bind(this);
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
      .catch(err => console.log(err))
  }

  afterGet(event){
    var container = this.refs.putPerfilHere;
    var userToView = this.state.userInfo;

    let singlePublicationHtml = (
      <Jumbotron className="py-4">
        <h1> Perfil de: {userToView.name}  </h1>
        <h3> <b> Tipo: </b> { userToView.typee === "userOnly" ? (
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
          <h3 className="text-primary"> No se ha creado ninguna publicación! </h3>
        </div>
      )
      ReactDOM.render(tempHtml, container);
    }

  }

  createPubCard(card){
    let new_html = '';
		let new_href = "/publication/" + card.id;
    //console.log(new_href);
		new_html = (
			  <Card className="indexMiniCard col-md-5 mx-2 justify-content-center">
			    <Card.Img className="reframe index-fluid mt-3" variant="top" src={card.media} alt={card.title} />
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
			      <a className="linkToPublication" href={new_href}>Ver mas</a>
			    </Card.Body>
			    <Card.Footer>
			      <small className="text-muted">Fecha de publicación: {card.date}</small>
			    </Card.Footer>
			  </Card>
		)
		return new_html
  }

  componentDidMount() {
		this.getUserInfo();
    this.getUserPubs();
	}

  render() {
      return (
        <div className="row mx-auto mt-5 justify-content-around">
          <div className="col-6 mx-auto" id="PerfilView" ref="putPerfilHere">
          </div>
          <div className="col-6 mx-auto" id="PerfilPubs">
            <Jumbotron className="py-4">
              <h2> Publicaciones del perfil: </h2>
              <div className="row justify-content-around" ref="putPubsHere"> </div>
            </Jumbotron>
          </div>
        </div>
      );
    }

}

export default Perfil;
