import React, { Component } from 'react';
import './App.css';
import UserList from './components/UserList';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

class App extends Component {
  render() {
    return (

      <Router>
        <Switch>
          <Route exact path="/" render={() => (
            <Redirect to="/userlist" />
          )} />
          <Route exact path='/userlist' component={UserList} />
        </Switch>
      </Router>
    );
  }
}

export default App;