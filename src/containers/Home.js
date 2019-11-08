import React from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import MyNavbar from '../components/MyNavbar';
import MyCardDeck from '../components/MyCardDeck';

const Home = () => {
  return(
    <>
      <div id="NavigationBar">
        <MyNavbar />
      </div>
      <div className="App">
        <MyCardDeck />
      </div>
    </>
  );

}
export default Home;
