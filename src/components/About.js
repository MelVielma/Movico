import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css';

class About extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      about: 'Movico es una plataforma que impulsa la industria mexicana de la animación, diseño digital y motion graphics. Funciona como un escaparate y al mismo tiempo como fuente de inspiración para artistas digitales, diseñadores y animadores mexicanos que quieran conocer qué es lo que se está haciendo en su país en la industria a la que pertenecen. \
              \nMovico es un espacio para conectar, inspirar y resaltar. Se dará difusión a cortos animados (2D, 3D, Stop Motion) así como a comerciales, videos de motion graphics, diseño y animación de títulos, cortinillas televisivas y todo tipo de proyectos que involucren algún tipo de animación.'
    };
  }

  render() {
      return (
        <div id="aboutDiv" className="m-4">
            <p>{this.state.about}</p>
        </div>
      );
    }

}

export default About;
