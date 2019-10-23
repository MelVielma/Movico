import React from 'react';
import CardDeck from 'react-bootstrap/CardDeck';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button'

/* para importar publication desde el archivo principal : import Publication from './path/to/component'; */
/* para usar el componente desde el archivo principal <Publication /> */
/* text == prop ...  <Example6 text="Hello World" /> */

class PublicationDeck extends React.Component {
	constructor(props){
		super(props);
	}
	render(){
		return (
			<div>
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
}

export default PublicationDeck;  





