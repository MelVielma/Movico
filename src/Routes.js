import React from 'react';
import {Switch , Route} from 'react-router-dom';
import Home from './containers/Home';
import PublicationView from './containers/PublicationView';
import PerfilView from './containers/PerfilView';

const  Routes = () => {
  return(
    <Switch>
      <Route path='/' exact component={Home} />
      <Route path='/publication/:pubId' component={PublicationView} />
      <Route path='/perfil' component={PerfilView} />
    </Switch>
  );
}

export default Routes;
