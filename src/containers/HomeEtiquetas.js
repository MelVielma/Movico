import React from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import MyCardDeck from '../components/MyCardDeck';

class HomeEtiquetas extends React.Component{
  render(){
    console.log("Deberiamos de buscar: ", this.props.match.params.tags)
    return(
      <>
        <div className="App">
          <MyCardDeck tags={this.props.match.params.tags} />
        </div>
      </>
    );
  }
}
export default HomeEtiquetas;
