import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css';
import {Form, Button} from 'react-bootstrap';
import WarningAlert from './WarningAlert';
import SuccessAlert from './SuccessAlert';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class CreatePostForm extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      postTitle : '',
      postAuthor : '',
      postBusiness : '',
      postDescription : '',
      postMultimedia : '',
      postTags : '',
      postDate: new Date(),
      userId : '',
      userToken: '',
    };

    this.createPetition = this.createPetition.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.afterCreate = this.afterCreate.bind(this);
    this.handleCreateError = this.handleCreateError.bind(this);
  }

  componentDidMount(){
    let usrToken = localStorage.getItem('user_token');
    let usrId = localStorage.getItem('user_id');
    if(usrToken && usrId){
      this.setState({ userToken: usrToken });
      this.setState({ userId: usrId });
    } else {
      //TODO: mostrar mensaje de error porque no puede crear un post sin haber inciiado sesion
      console.log("Error el usuario no ha iniciado sesión.")
    }
  }

  createPetition(){
    let loginPetition = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
    		'Content-Type': 'application/json',
    		'Origin': '',
    		'Host': 'https://movico.herokuapp.com',
        Authorization: 'Bearer ' + this.state.userToken,
      },
      body: JSON.stringify({
        title: this.state.postTitle,
        business_name: this.state.postBusiness,
        text: this.state.postDescription,
        media: this.state.postMultimedia,
        idpub: this.state.userId,
        author: this.state.postAuthor,
        date: this.state.postDate,
        tags: this.state.postTags
      })
    }
    return loginPetition;
  }

  //Que haces despues de haber iniciado sesion
  afterCreate(event){
    ReactDOM.render(<div /> , this.refs.createPostFormDiv) //Limpiar el div en donde se pondra el asunto
    var html = (
      <SuccessAlert
        title="Publicacion Creada!"
      />
    )
    ReactDOM.render(html , this.refs.createPostFormDiv)
  }

  //Que hacer si hay error en el login
  handleCreateError(err){
    console.log(err);

    ReactDOM.render(<div /> , this.refs.createPostFormDiv) //Limpiar el div en donde se pondra el asunto
    var err_html = (
      <WarningAlert
        title="Algo salio mal"
        text="Checa si ya iniciaste sesión bro."
      />
    );
    ReactDOM.render(err_html , this.refs.createPostFormDiv)
  }

  handleSubmit(event){
    event.preventDefault();

    //Pasar los tags de un string a un arreglo
    var tagsSeparated = this.state.postTags.split(',').map(function(item) {
      return item.trim();
    });
    console.log("Tags separados: ", tagsSeparated);
    this.setState({ postTags: tagsSeparated });

    //Crear headers y body para la peticion al server
    var petition = this.createPetition();
    console.log("Peticion de creacion: ", petition);
    fetch('/publications', petition)
      .then(function(response){
        if(!response.ok){
          throw Error(response.statusText);
        }
        return response.json();
      })
      .then(state => this.setState({user_json: state}, () =>
        this.afterCreate()))
      .catch(err => this.handleCreateError(err));
  }

  handleChange(event){
    if(event.target.id === 'post_Title'){
      this.setState({postTitle : event.target.value});
    }
    else if(event.target.id === 'post_Author'){
      this.setState({postAuthor : event.target.value});
    }
    else if(event.target.id === 'post_Business'){
      this.setState({postBusiness : event.target.value});
    }
    else if(event.target.id === 'post_Text'){
      this.setState({postDescription : event.target.value});
    }
    else if(event.target.id === 'post_Media'){
      this.setState({postMultimedia : event.target.value});
    }
    else if(event.target.id === 'post_Tags'){
      this.setState({postTags : event.target.value});
    }
  }

  handleDateChange = date => {
    this.setState({ postDate: date });
  }

  render() {
      let isUserLogged = this.props.isUserLogged;
      return (
        <div id="createPostModal" className="m-4">
            {!isUserLogged ? (
              <div id="userNotLoggedDiv"><b> Primero incia sesión! </b></div>
            ):(
              <>
                <div ref="createPostFormDiv" />
                <Form id="createPostForm" onSubmit={this.handleSubmit}>
                  <Form.Group>
                    <Form.Label> Titulo de la obra: *</Form.Label>
                    <Form.Control id="post_Title" required type="text" size="lg" value={this.state.postTitle} onChange={this.handleChange} placeholder="Titulo de la publicacion." />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label> Autor: *</Form.Label>
                    <Form.Control id="post_Author" required type="text" value={this.state.postAuthor} onChange={this.handleChange} placeholder="Autor de la publicacion." />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label> Empresa: *</Form.Label>
                    <Form.Control id="post_Business" required type="text" value={this.state.postBusiness} onChange={this.handleChange} placeholder="Empresa de la publicacion." />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label> Descripcion de la obra: * </Form.Label>
                    <Form.Control id="post_Text" required as="textarea" rows="3" value={this.state.postDescription} onChange={this.handleChange} placeholder="Acerca de la publicación, cómo se hizo, qué significa, que mensaje transmite, etc." />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label> Fecha de creación: </Form.Label>
                    <DatePicker id="post_Date" selected={this.state.postDate} onChange={this.handleDateChange} />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label> Etiquetas la obra: </Form.Label>
                    <Form.Control id="post_Tags" as="textarea" rows="2" value={this.state.postTags} onChange={this.handleChange} placeholder="Por ejemplo: Animación, Fotografía, Realidad, etc." />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label> Link de multimedia: *</Form.Label>
                    <Form.Control id="post_Media" required type="text" value={this.state.postMultimedia} onChange={this.handleChange} placeholder="Liga a una imágen, video, etc." />
                  </Form.Group>
                  <div><b> * Son campos requeridos </b></div>
                  <Button variant="primary" type="submit">
                    Subir
                  </Button>
                </Form>
              </>
            )}
        </div>
      );
    }

}

export default CreatePostForm;
