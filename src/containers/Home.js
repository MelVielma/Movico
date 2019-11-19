import React from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import MyCardDeck from '../components/MyCardDeck';

const Home = () => {
  return(
    <>
      <div className="App">
        <MyCardDeck />
      </div>
    </>
  );

}
export default Home;
