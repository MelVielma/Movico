import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import SinglePublicationView from '../components/SinglePublicationView'
import '../index.css';
import '../App.css';

class PublicationView extends React.Component{
  render(){
    return(
      <>
        <div className="App">
           <SinglePublicationView pubId = {this.props.match.params.pubId} />
        </div>
      </>
    );
  }
}

export default PublicationView;
