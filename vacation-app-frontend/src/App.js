import React from 'react';

import Login from './user/Login';
import Vacation from './vacation/Vacation';
import { Route, Switch } from 'react-router-dom';


function App() {
  return (
    <>
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/main" exact component={Vacation} />
      </Switch>
    </>
  );
}

export default App;
