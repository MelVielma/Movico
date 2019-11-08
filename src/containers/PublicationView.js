import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import MyNavbar from '../components/MyNavbar';
import SinglePublicationView from '../components/SinglePublicationView'
import '../index.css';
import '../App.css';

class PublicationView extends React.Component{
  render(){
    return(
      <>
        <div id="NavigationBar">
          <MyNavbar />
        </div>
        <div className="App">
           <SinglePublicationView pubId = {this.props.match.params.pubId} />
        </div>
      </>
    );
  }
}

export default PublicationView;
