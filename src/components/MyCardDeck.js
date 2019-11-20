import React from 'react';
import ReactDOM from 'react-dom';
import Card from 'react-bootstrap/Card';
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

var nameAuthor = {
	method: 'GET',
	headers: {
		'Accept': 'application/json',
		'Contenct-Type': 'application/json',
		'Origin': '',
		'Host': 'http://localhost:3001',
		'Authorization': `Bearer ${localStorage.getItem('user_token')}`
	}
}

class PublicationDeck extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			tagsToSearch: this.props.tags,
			publications: '',
			nameAuthor: ''
		}
		this.createCard = this.createCard.bind(this);
		this.getPublications = this.getPublications.bind(this);
		this.getAuthor = this.getAuthor.bind(this);
		this.afterGet = this.afterGet.bind(this);
	}

	getPublications(event) {
		fetch('/publications', publications2)
			.then(response => response.json())
			.then(state => this.setState({publications: state}, () =>
				this.afterGet()));
	}

	getTagPublications(event) {
		let searchingTag = this.state.tagsToSearch;
		this.setState({tagsToSearch : ''});
		//window.location.reload();
	}

	getAuthor(user_id) {
		fetch('/publications/' + user_id, nameAuthor)
			.then(response => response.json())
			.then(state => this.setState({nameAuthor: state}, () =>
				this.afterGet()));
		console.log(this.state)
	}

	afterGet(event) {
		var container = this.refs.container
		var cards = [];
		const pubs = this.state.publications;

		for(let i = 0 ; i < pubs.length ; i++) {
			let tempHtml = this.createCard(pubs[i])
			cards.push(tempHtml)
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
			  <Card className="indexMiniCard col-md-3 m-3 justify-content-center">
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

	render(){
		//console.log("tagsToSearch: ",this.state.tagsToSearch)
		return (
			<div ref='container' className="indexCardDeck row justify-content-center">
				{/* <CardDeck  className="indexCardDeck">
				</CardDeck> */}

			</div>
		)
	}

	componentDidMount() {
		//HACER LA BUSQUEDA POR TAGS CUANDO SE AGREGAN
		if(this.state.tagsToSearch !== ''){
			this.getTagPublications()
		} else {
			this.getPublications()
		}
	}
}

export default PublicationDeck;
