import React from 'react';
import ReactDOM from 'react-dom';
import {Form, FormControl, Button, Card, Spinner} from 'react-bootstrap';
import {Animated} from "react-animated-css";
import '../index.css';

/* para importar publication desde el archivo principal : import Publication from './path/to/component'; */
/* para usar el componente desde el archivo principal <Publication /> */
/* text == prop ...  <Example6 text="Hello World" /> */

var publications2 = {
	method: 'GET',
	headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json',
		'Origin': '',
		'Host': 'http://localhost:3001',
		'Authorization': `Bearer ${localStorage.getItem('user_token')}`
	}
}

class PublicationDeck extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			tagsToSearch: '',
			publications: '',
			nameAuthor: '',
			displayAnimation: false
		}
		this.createCard = this.createCard.bind(this);
		this.getPublications = this.getPublications.bind(this);
		this.getAuthor = this.getAuthor.bind(this);
		this.afterGet = this.afterGet.bind(this);

		this.getByMultipleTags = this.getByMultipleTags.bind(this);
		this.getByOneTag = this.getByOneTag.bind(this);
		this.updateAnimationStatus = this.updateAnimationStatus.bind(this);
	}

	getPublications(event) {
		fetch('https://movico.herokuapp.com/publications', publications2)
			.then(response => response.json())
			.then(state => this.setState({publications: state}, () =>
				this.afterGet()))
			.then(() => this.setState({displayAnimation: true}))
			.catch(err => console.log(err));
	}

	getByMultipleTags(event){
		let url = 'https://movico.herokuapp.com/publicationsByMultiTags/' + this.state.tagsToSearch;
		fetch(url, publications2)
			.then(response => response.json())
			.then(state => this.setState({publications: state}, () =>
				this.afterGet()))
			.then(() => this.setState({displayAnimation: true}))
			.catch(err => console.log(err));
	}

	getByOneTag(event){
		let url = 'https://movico.herokuapp.com/publicationsByTag/' + this.state.tagsToSearch;
		console.log('/publicationsByTag/', url);
		fetch(url, publications2)
			.then(response => response.json())
			.then(state => this.setState({publications: state}, () =>
				this.afterGet()))
			.then(() => this.setState({displayAnimation: true}));
	}

	getTagPublications(event) {
		let searchingTags = this.state.tagsToSearch.split(',').map(function(item) {
      return item.trim();
    });

		if(searchingTags.length > 1){
			this.getByMultipleTags();
		} else if(searchingTags.length === 1){
			this.getByOneTag();
		} else {
			console.log("No se ni como llegaste aqui dude");
		}
	}

	getAuthor(user_id) {
		fetch('https://movico.herokuapp.com/publications/' + user_id, publications2)
			.then(response => response.json())
			.then(state => this.setState({nameAuthor: state}, () =>
				this.afterGet()));
		console.log(this.state)
	}

	afterGet(event) {
		var container = this.refs.container
		var cards = [];
		const pubs = this.state.publications;

		if(pubs < 1){
			var cards = '';
			cards = (
				<Card className="">
					<h1>
						No se encontró ningúna publicación con esa etiqueta! :(
					</h1>
				</Card>
			)
		} else {
			for(let i = 0 ; i < pubs.length ; i++) {
				let tempHtml = this.createCard(pubs[i])
				cards.push(tempHtml)
			}
		}
		//console.log("**type of cards", typeof(cards))
		ReactDOM.render(cards, container);
	}

	updateAnimationStatus(event){
		this.setState({displayAnimation: false});
	}

	createCard(card) {
		//console.log(card)
		let new_html = '';
		let new_href = "/publicacion/" + card.id;
		new_html = (
		  	  <Card className="indexMiniCard homePage m-3 col-12 col-md-5 col-lg-3 justify-content-center">
				    <a href={new_href}>
				    <a href={new_href}>
				    	<Card.Img className="reframe index-fluid mt-3" variant="top" src={card.media} alt={card.title} onClick={() => this.updateAnimationStatus()} />
				    </a>
				    <Card.Body>
				      <Card.Title>{card.title}</Card.Title>
				      <Card.Subtitle className="mb-2 text-muted">{card.author}</Card.Subtitle>
				      <Card.Text className="cardTextLimit">
				        {card.text}
				      </Card.Text>
				      <a className="linkToPublication" href={new_href} onClick={() => this.updateAnimationStatus()}>Ver mas</a>
				    </Card.Body>
				    <Card.Footer>
				      <small className="text-muted">Fecha de publicación: {new Date(card.date).toLocaleDateString()}</small>
				    </Card.Footer>
				  </a>
			  </Card>

		)
		return new_html
	}

	//Actualizar el valor de las etiquetas a ser buscadas
	handleTagChange = (event) =>{
		this.setState({tagsToSearch : event.target.value});
	}
	handleTagSearch = (event) =>{
		event.preventDefault();
		if(this.state.tagsToSearch !== '' && this.state.tagsToSearch !== undefined ){
			this.getTagPublications();
		}
	}

	render(){
		//console.log("tagsToSearch: ",this.state.tagsToSearch)
		return (
			<div className="whiteColorBackground col-10 mx-auto mt-4">
				<div className="whiteColorBackground my-4 flex-column d-md-flex flex-md-row-reverse">
					<Form inline className="justify-content-center" onSubmit={this.handleTagSearch}>
						<FormControl value={this.state.tagsToSearch} onChange={this.handleTagChange} type="text" placeholder="Etiqueta a buscar" className="tertiaryColorText mr-sm-2" />
						<Button className="mt-3 mt-md-0 btnPublicaciones" onClick={this.handleTagSearch}>Buscar</Button>
					</Form>
				</div>
				<Animated animationIn="fadeIn" animationOut="fadeOut" isVisible={this.state.displayAnimation}>
					<div ref='container' className="whiteColorBackground indexCardDeck row mx-auto container justify-content-around">
						<Spinner animation="grow" variant="light" />
					</div>
				</Animated>
			</div>
		)
	}

	componentDidMount() {
		document.body.classList.add("whiteColorBackground")
		document.getElementsByClassName('App')[0].classList.add("whiteColorBackground")

		if(this.props.tags === '' || this.props.tags === undefined ){
			//console.log("NO voy a buscar", this.state.tagsToSearch)
			this.getPublications()
		} else {
			this.state.tagsToSearch = this.props.tags;
			this.getTagPublications();
		}
	}
}

export default PublicationDeck;
