import React from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import MyCardDeck from '../components/MyCardDeck';
import MyNavbarWithoutTags from '../components/MyNavbarWithoutTags';

const Home = () => {
  return(
    <>
      <div id="NavigationBar">
        <MyNavbarWithoutTags />
      </div>
      <div className="App">
        <MyCardDeck />
      </div>
    </>
  );

}
export default Home;
