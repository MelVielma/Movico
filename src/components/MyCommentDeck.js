import React from 'react';
import ReactDOM from 'react-dom';
import CardDeck from 'react-bootstrap/CardDeck';
import Card from 'react-bootstrap/Card';
import { Form, Button, Spinner } from 'react-bootstrap';
import {Animated} from "react-animated-css";
import Modal from 'react-bootstrap/Modal';
import '../index.css';

/* para importar publication desde el archivo principal : import Publication from './path/to/component'; */
/* para usar el componente desde el archivo principal <Publication /> */
/* text == prop ...  <Example6 text="Hello World" /> */

var comentariosPosteados = []

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

var delComment = {
	method: 'DELETE',
	headers: {
		'Accept': 'application/json',
		'Contenct-Type': 'application/json',
		'Origin': '',
		'Host': 'http://localhost:3001',
		'Authorization': `Bearer ${localStorage.getItem('user_token')}`
	}
}

var postInfoToServer = function (info) {
  console.log("info", info)
  return {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Origin': '',
      'Host': 'http://localhost:3001',
	  'Authorization': `Bearer ${localStorage.getItem('user_token')}`
    },
    body: JSON.stringify(
      info
    ),
	}
}

class CommentsView extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			userInfo: '',
			commentText: undefined,
			message: 'El comentario está vacío.',
			showMessageModal : false,
			comments: undefined,
			commentsDone: false,
			nombreUsuario: '',
			htmlComments: []
		};
		this.displayMessageModal = React.createRef();
		this.formCommentText = React.createRef();


		this.getAuthor = this.getAuthor.bind(this);
		this.afterGet = this.afterGet.bind(this);
		this.createComment = this.createComment.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.appendCommentBox = this.appendCommentBox.bind(this);
		this.hideMessageModalHandler = this.hideMessageModalHandler.bind(this);
		this.addComentarioPosteado = this.addComentarioPosteado.bind(this);
		this.updateCommentSection = this.updateCommentSection.bind(this);
		this.handleEliminateComment = this.handleEliminateComment.bind(this);
	}

	updateCommentSection(htmlCommentarios) {
		var container = this.refs.container;
		let cards = htmlCommentarios;
		if (cards.length === comentariosPosteados.length) {
			ReactDOM.render(cards, container);
		}
	}

	hideMessageModalHandler = (event) =>{
	    this.state.showMessageModal = false;
	    this.forceUpdate();
	  }

	addComentarioPosteado(comment) {
		console.log('addComentarioPosteado',comment)
		comentariosPosteados.concat(comment)
		return comment
	}

	handleSubmit(event) {
		console.log("handleSubmit", event)
		let fetch_url = "/comments/"+ this.props.listComments.id;
		event.preventDefault();
		let comentarioTemp = '';
		let jsonContent = {
			'user': localStorage.getItem('user_id'),
			'text': this.state.commentText,
			'date': new Date()
	    }
	    this.setState({commentText: ''})
	    //this.refs.formCommentText.value = "";
	    this.getAuthor(jsonContent.user);
	    if (this.state.commentText !== undefined) {
		    if(this.state.commentText.length > 0) {
		    fetch(fetch_url, postInfoToServer(jsonContent))
		    	.then(response => response.json())
		    	.then(response => this.addComentarioPosteado(response))
		    	.then(response => this.setState({htmlComments: this.state.htmlComments.concat(this.createComment(response, this.state.userInfo))}))
		    	.then(() => this.setState({message: 'Se añadió el comentario.'}))
		    	.then(state => this.setState({showMessageModal: true}))
		    	//.then(state => this.appendCommentBox())
		    	//.then(() => this.updateCommentSection(this.state.htmlComments))
		    	.catch(err => console.log(err))
		    }
		    else
		    {
		    	this.setState({message: 'El comentario está vacío.'})
				this.setState({showMessageModal: true});
		    }
		}
		else
		{
			this.setState({message: 'El comentario está vacío.'})
			this.setState({showMessageModal: true});
		}
	}

	handleChange(event) {
		this.setState({commentText: event.target.value});
		console.log('handleChange', this.state.commentText);
	}

	getAuthor(user_id) {
		fetch('/users/' + user_id, nameAuthor)
			.then(response => response.json())
			.then(state => this.state.userInfo= state)
			.then(state => this.setState({userInfo: state}))
			.then(() => console.log('myCommentDeck',this.state.userInfo))
		console.log('getAuthor', this.state.userInfo)
		return this.state.userInfo
	}

	displayMessage(message){
	    console.log("Se despliega el mensaje:", this.state.message)
	    this.state.showMessageModal = true;
	    try {
	      this.afterGet();
	    }
	    catch(err) {
	      	console.log("Publicación no accesible");
		}
	}

	afterGet(event) {
		if (this.state.comments !== undefined) {
			console.log("comments no es undefined?", this.state.comments !== undefined)
			let listaDeComments = comentariosPosteados
			console.log("listaDeComments.length", listaDeComments)
			if (listaDeComments.length == 0) {
				this.appendCommentBox(this.state.htmlComments)
			}

			for(let i = 0 ; i < listaDeComments.length ; i++) {
				let user_id = listaDeComments[i].user
				fetch('/users/' + user_id, nameAuthor)
					.then(response => response.json())
					.then(state => this.setState({userInfo: state}))
					.then(state => this.setState({htmlComments: this.state.htmlComments.concat(this.createComment(listaDeComments[i], this.state.userInfo))}))
					.then(state => this.updateCommentSection(this.state.htmlComments))
					.catch(err => console.log(err))
			}
			this.setState({commentsDone: true});

		}
		else
		{
			this.appendCommentBox(this.state.htmlComments)
		}
	}

	appendCommentBox(htmlComentarios) {
		console.log("appendCommentBox", this.state.commentText);
		var container = this.refs.writeComment;
		let isUserLogged = this.props.isUserLogged;
		let placeholderText = ''
		let enableStatus = ''
		if (isUserLogged) {
			placeholderText = "Escribe aquí tu comentario...";
		}
		else
		{
			placeholderText = "Ingresa a tu cuenta para escribir un comentario";
			enableStatus = "disabled";
		}
		let inputCommentHtml = (
			<Card className="indexCardComment col-md-8 justify-content-center">
			    <Card.Body>
			      <Card.Title>Comentario</Card.Title>
			      	<Form>
			      		<Form.Control value={this.state.commentText} onChange={this.handleChange} type="text" as="textarea" rows="3" placeholder={placeholderText} disabled={enableStatus} />
			      	</Form>
			      {isUserLogged ? (
			      	<Button variant="primary" type="submit" onClick={this.handleSubmit}>Añadir Comentario</Button>
			      	):(
			      	<>
			      	</>
			      	)
			      }
			    </Card.Body>
			 </Card>
			)
		ReactDOM.render(inputCommentHtml,container);
		
	}

	createComment(card, nameUser) {
		//console.log('createComment',card)
		let isAdmin = false;
		if(this.props.isUserLogged) {
			if(this.props.userTypee === 'admin') {
				isAdmin = true;
			}
		}
		let new_html = '';
		new_html = (
			  <Card className="indexMiniCard col-md-8 m-3 justify-content-center">
			    <Card.Body>
			      <Card.Title>{nameUser.name}</Card.Title>
			      <Card.Subtitle className="mb-2 text-muted">{card.date}</Card.Subtitle>
			      <Card.Text>
			        {card.text}
			      </Card.Text>
			      {isAdmin ? (
			      		<Button value={card._id} variant="warning" type="submit" onClick={e => this.handleEliminateComment(e.target.value)}>Eliminar Comentario</Button>
			      	)
			      	:
			      	(
			      	<>
			      	</>
			      	)
			      }
			    </Card.Body>
			  </Card>
		)
		return new_html
	}

	handleEliminateComment(comment_id) {
		console.log(comment_id);
		console.log(comentariosPosteados);
		let tempComentarios = comentariosPosteados.filter(function(value, index, arr) {
			return value._id != comment_id
		})

		console.log("tempComentarios", tempComentarios)

		comentariosPosteados = tempComentarios;
		let fetch_url = "/comments/"+ comment_id;
		fetch(fetch_url, delComment)
			.then(() => this.setState({message: 'Se eliminó el comentario.'}))
			.then(() => this.setState({showMessageModal: true}))
			.then(() => this.setState({htmlComments: []}))
			.then(() => this.afterGet())
			.catch(err => console.log(err))
	}

	render(){
		console.log('se hizo render de nuevo')
		if(this.props.listComments !==undefined && !(this.state.commentsDone)) {
			console.log('render_MyCommentDeck', this.props)
			this.state.comments = this.props.listComments;
			comentariosPosteados = this.state.comments.comments
			console.log("render", "llame a afterGet y setState commentsDone")
			this.afterGet()
			this.setState({commentsDone: true})
		}
		return (
			<>
			<div>
	          <Modal ref="displayMessageModal" show={this.state.showMessageModal} onHide={this.hideMessageModalHandler}>
	            <Modal.Header closeButton>
	              <Modal.Title>{this.state.message}</Modal.Title>
	            </Modal.Header>
	          </Modal>
	        </div>
	        <Animated animationIn="fadeIn" animationOut="fadeOut" isVisible={true}>
	        <div ref='writeComment' className="indexCardDeck row col-md-12 justify-content-center">
	        </div>
			    <div ref='container' className="indexCardDeck row col-md-12 justify-content-center">
					<Spinner animation="grow" variant="light" />
					{/* <CardDeck  className="indexCardDeck">
					</CardDeck> */}
				</div>
			</Animated>
			</>
		)
	}

	componentDidMount() {
		console.log("ya se hizo mount de myCommentDeck")
		this.appendCommentBox();
	}
}

export default CommentsView;
