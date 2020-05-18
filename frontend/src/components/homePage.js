import React from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import { Route, Link, BrowserRouter as Router} from 'react-router-dom';
import {
  withRouter
} from 'react-router-dom';
import Input from './input';
import MainText from './mainText';
import MapAll from './mapAll'


class HomePage extends React.Component {
    render() {
      return <div className= "logo">
      <h1 align="center">VÄLKOMMEN TILL GRUPPERA!</h1>
      <MainText/>
      <Input/>
      <MapAll/>
      </div>;
    }
}
export default HomePage
