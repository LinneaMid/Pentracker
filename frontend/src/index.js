import React from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import { Route, Link, BrowserRouter as Router, Switch } from 'react-router-dom';
import HomePage from './components/homePage';
import InputName from './inputName';
import penHistory from './penHistory';
import notFound from './notFound';
import Input from './components/homePage';
import "./web.config";
//import cookie from 'react-cookies'
import config from 'react-global-configuration';
import configuration from './components/config';
//import fillIn from './components/cookieName'

config.set(configuration);

const routing = (
  <Router>
    <div>
      <Switch>
      <Route exact path="/" component={HomePage} />
      <Route path="/PenId" component={Input}/>
      <Route path="/:penId" component={penHistory} />
      {/* <Route path="/History" component={penHistory} /> */}
      <Route component={notFound}/>
      </Switch>
    </div>
  </Router>
)

ReactDOM.render(routing, document.getElementById('root'))