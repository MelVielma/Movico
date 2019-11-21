import React from 'react';
import ReactDOM from 'react-dom';
import {Form, FormControl, Button, Card} from 'react-bootstrap';
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
			nameAuthor: ''
		}
		this.createCard = this.createCard.bind(this);
		this.getPublications = this.getPublications.bind(this);
		this.getAuthor = this.getAuthor.bind(this);
		this.afterGet = this.afterGet.bind(this);

		this.getByMultipleTags = this.getByMultipleTags.bind(this);
		this.getByOneTag = this.getByOneTag.bind(this);
	}

	getPublications(event) {
		fetch('/publications', publications2)
			.then(response => response.json())
			.then(state => this.setState({publications: state}, () =>
				this.afterGet()))
				.catch(err => console.log(err));;
	}

	getByMultipleTags(event){
		let url = '/publicationsByMultiTags/' + this.state.tagsToSearch;
		console.log('/publicationsByMultiTags/', url);
		fetch(url, publications2)
			.then(response => response.json())
			.then(state => this.setState({publications: state}, () =>
				this.afterGet()))
			.catch(err => console.log(err));
	}

	getByOneTag(event){
		let url = '/publicationsByTag/' + this.state.tagsToSearch;
		console.log('/publicationsByTag/', url);
		fetch(url, publications2)
			.then(response => response.json())
			.then(state => this.setState({publications: state}, () =>
				this.afterGet()));

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
		fetch('/publications/' + user_id, publications2)
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

	createCard(card) {
		//console.log(card)
		let new_html = '';
		let new_href = "/publicacion/" + card.id;
		//console.log(new_href);
		new_html = (
			  <Card className="indexMiniCard col-md-3 justify-content-center">
			    <Card.Img className="reframe index-fluid mt-3" variant="top" src={card.media} alt={card.title} />
			    <Card.Body>
			      <Card.Title>{card.title}</Card.Title>
			      <Card.Subtitle className="mb-2 text-muted">{card.author}</Card.Subtitle>
			      <Card.Text>
			        {card.text}
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
			<div className="col-10 mx-auto mt-4">
				<div className="my-4 d-flex">
					<Form inline className="ml-auto justify-self-right" onSubmit={this.handleTagSearch}>
						<FormControl value={this.state.tagsToSearch} onChange={this.handleTagChange} type="text" placeholder="Etiqueta a buscar" className="mr-sm-2" />
						<Button variant="primary" onClick={this.handleTagSearch}>Buscar</Button>
					</Form>
				</div>
				<div ref='container' className="indexCardDeck row justify-content-around">
				</div>
			</div>
		)
	}

	componentDidMount() {
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
