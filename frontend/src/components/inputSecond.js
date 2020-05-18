import React from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import {
  withRouter
} from 'react-router-dom';
import cookie from 'react-cookies'
import config from 'react-global-configuration';
import fillIn from './cookieName';
import { Redirect } from 'react-router';
import HomePage from './homePage';
import { Route, Link, BrowserRouter as Router, Switch } from 'react-router-dom';


class InputSecond extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: '' };
    const currentRoute = this.props.location.pathname
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state.value = cookie.load("onboarded");


  }

  penId;
  resdata;

  handleChange(event) {
    this.setState({ value: event.target.value});
  }

  redirectHome () {
    this.props.history.push("/");
  }

  componentDidMount() {
    const { penId } = this.props.match.params
    this.penId = penId;
    const val = {
      name: this.state.value
    };
    this.fillIn = fillIn;


    
  };

  handleSubmit(event) {
    event.preventDefault();


    const val = {
      name: this.state.value
    };

  };

  onSubmit = () => {
    //console.log('clicked');
    const val = {
      name: this.state.value
    };

    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };
    var janne = this.penId;
    navigator.geolocation.getCurrentPosition(success, error, options);
    function success(pos) {
      var crd = pos.coords;

      //console.log('Your current position is:');
      //console.log(`Latitude : ${crd.latitude}`);
      //console.log(`Longitude: ${crd.longitude}`);

      let req = {
        Name: val.name,
        LocationLAT: crd.latitude,
        LocationLONG: crd.longitude,
      }

      var otto = janne;
      //console.log(req)


      axios.post(`${config.get('apiString')}pen/${otto}`, req,
        {
          headers: {
            'Content-type': "application/json"
          }
        })
        .then(res => {
          //console.log(res);
          //console.log(res.data);
          //console.log(crd.latitude);
          //console.log(crd.longitude);

          cookie.save("onboarded", val.name,
            {
              expires: new Date(2095, 11, 17, 3, 24, 0),
            }
          )
  //console.log(cookie.load("onboarded"))
  //console.log("test efter cookie")

        })
    }
    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
      success({ coords: { latitude: null, longitude: null } })
    }
  }

  render() { 
 
    return <div className="inputLook">
      {this.props.children}

      
  

    <form align="center" onSubmit={this.handleSubmit} >
      <div class="row">
        <div class="col">
         
          <input  type="text" className="form-control" placeholder="Namn" value={this.state.value} onChange={this.handleChange} name ='Name' />
        </div>
    </div>
        <div className="sub">
          <button type="submit" onClick={this.onSubmit} >Skicka</button>
        </div>
    </form>
    </div >
  }
}

export default withRouter(InputSecond)