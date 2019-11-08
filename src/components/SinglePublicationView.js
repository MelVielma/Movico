import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css';
import {Jumbotron, Card} from 'react-bootstrap';

var getSinglePubFromServer = {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Origin': '',
    'Host': 'http://localhost:3001'
  }
}

class SinglePublicationView extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      pubId: this.props.pubId,
      publication: ''
    };
    this.getPublicationInfo = this.getPublicationInfo.bind(this);
    this.afterGet = this.afterGet.bind(this);
    this.headerInfo = this.headerInfo.bind(this);

  }

  getPublicationInfo(event){
    let fetch_url = "/publications/" + this.state.pubId;
    fetch(fetch_url, getSinglePubFromServer)
      .then(response => response.json())
      .then(state => this.setState({publication: state}, () =>
        this.afterGet()));
  }

  headerInfo(myPublication){
    return (
        <div className = "headerInfo">
          <h1> {myPublication.title} </h1>
          <h2><i> Autor: {myPublication.author} </i></h2>
          <h3>Empresa: {myPublication.business_name}</h3>
        </div>
      )
  }

  afterGet(event){
    var container = this.refs.putSinglePubHere;
    var myPublication = this.state.publication[0];
    console.log("Estado after get single publ: ",myPublication);

    let singlePublicationHtml = (
      <Jumbotron>
        <h1> {myPublication.title} </h1>
        <h2><i> Autor: {myPublication.author} </i></h2>
        <h3>Empresa: {myPublication.business_name}</h3>
        <img src={myPublication.media} alt={myPublication.title} height="350" />
        <h5><b>Fecha: </b>{myPublication.date} </h5>
        <h6> {myPublication.text[0]} </h6>
      </Jumbotron>
    )
    let headerInf = this.headerInfo(myPublication)
    ReactDOM.render(singlePublicationHtml, container);
  }

  componentDidMount() {
		this.getPublicationInfo()
	}

  render() {
      return (
        <div id="SinglePublicationView" ref="putSinglePubHere">
            <h1> {this.state.pubId} </h1>
        </div>

      );
    }

}

export default SinglePublicationView;
