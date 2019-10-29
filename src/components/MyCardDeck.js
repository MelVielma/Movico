import React from 'react';
import ReactDOM from 'react-dom';
import CardDeck from 'react-bootstrap/CardDeck';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button'
import Async from 'react-async'

/* para importar publication desde el archivo principal : import Publication from './path/to/component'; */
/* para usar el componente desde el archivo principal <Publication /> */
/* text == prop ...  <Example6 text="Hello World" /> */

var publications2 = {
	method: 'GET',
	headers: {
		'Accept': 'application/json',
		'Contenct-Type': 'application/json',
		'Origin': '',
		'Host': 'http://localhost:3001'
	}
}

var nameAuthor = {
	method: 'GET',
	headers: {
		'Accept': 'application/json',
		'Contenct-Type': 'application/json',
		'Origin': '',
		'Host': 'http://localhost:3001'
	}	
}

class PublicationDeck extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			publications: '',
			nameAuthor: ''
		}
		this.createCard = this.createCard.bind(this)
		this.getPublications = this.getPublications.bind(this)
		this.getAuthor = this.getAuthor.bind(this)
		this.afterGet = this.afterGet.bind(this) 
	}

	getPublications(event) {	
		fetch('/publications', publications2)
			.then(response => response.json())
			.then(state => this.setState({publications: state}, () =>
				this.afterGet()));
		console.log(this.state)
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

		console.log(this.state)

		const pubs = this.state.publications
		for(let i = 0; i< pubs.length;i++) {
			cards.push(this.createCard(pubs[i]))
		}
		ReactDOM.render(<CardDeck>{cards}</CardDeck>, container);
	}

	createCard(card) {
		console.log(card.media)
		let new_html = ''

		new_html = (
			  <Card>
			    <Card.Img variant="top" src={card.media} alt="Placeholder of an image." />
			    <Card.Body>
			      <Card.Title>{card.title}</Card.Title>
			      <Card.Subtitle className="mb-2 text-muted">{card.author}</Card.Subtitle>
			      <Card.Text>
			        {card.text}
			      </Card.Text>
			      <Button variant="dark">Ver mas</Button>
			    </Card.Body>
			    <Card.Footer>
			      <small className="text-muted">Fecha de publicación: {card.date}</small>
			    </Card.Footer>
			  </Card>
		)
		return new_html
	}

	render(){
		return (
			<div ref='container'>
			  <CardDeck>
			  <Card>
			    <Card.Img variant="top" src="holder.js/100px160" />
			    <Card.Body>
			      <Card.Title>Titulo de publicacion</Card.Title>
			      <Card.Subtitle className="mb-2 text-muted"> Autor de la publicacion </Card.Subtitle>
			      <Card.Text>
			        Descripcion
			      </Card.Text>
			      <Button variant="dark">Ver mas</Button>
			    </Card.Body>
			    <Card.Footer>
			      <small className="text-muted">fecha de publicacion</small>
			    </Card.Footer>
			  </Card>
			  <Card>
			    <Card.Img variant="top" src="holder.js/100px160" />
			    <Card.Body>
			      <Card.Title>Titulo de publicacion</Card.Title>
			      <Card.Subtitle className="mb-2 text-muted"> Autor de la publicacion </Card.Subtitle>
			      <Card.Text>
			        Descripcion
			      </Card.Text>
			      <Button variant="dark">Ver mas</Button>
			    </Card.Body>
			    <Card.Footer>
			      <small className="text-muted">fecha de publicacion</small>
			    </Card.Footer>
			  </Card>
			  <Card>
			    <Card.Img variant="top" src="holder.js/100px160" />
			    <Card.Body>
			      <Card.Title>Titulo de publicacion</Card.Title>
			      <Card.Subtitle className="mb-2 text-muted"> Autor de la publicacion </Card.Subtitle>
			      <Card.Text>
			        Descripcion
			      </Card.Text>
			      <Button variant="dark">Ver mas</Button>
			    </Card.Body>
			    <Card.Footer>
			      <small className="text-muted">fecha de publicacion</small>
			    </Card.Footer>
			  </Card>
			</CardDeck>
			</div>
		)
	}

	componentDidMount() {
		this.getPublications()
	}
}

export default PublicationDeck;  





