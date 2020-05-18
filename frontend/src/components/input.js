import React from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import { Route, Link, BrowserRouter as Router} from 'react-router-dom';
import {
  withRouter
} from 'react-router-dom';
import config from 'react-global-configuration';

class Input extends React.Component {
  
    constructor(props) {
      super(props);
      this.state = {value: ''};
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event) {
      this.setState({ value: event.target.value.toUpperCase() });
    }
  
    handleSubmit(event) {
      //alert('A PenId was submitted: ' + this.state.value);
      event.preventDefault();
  
      const val = {
        ID: this.state.value
    };
  
     //axios.get(`https://localhost:5001/api/pen/${val.ID}`)
    axios.get(`${config.get('apiString')}pen/${val.ID}`)
        .then(res => {
          //console.log(res);
          //console.log(res.data); 
          if (val.ID.status =='404'){
            alert("Please input a correct PenId")
            console.log("Fel PenID")
          } 
          else if(val.ID.length === 5){

            this.props.history.push(`./${val.ID}`);
          }
          else{
            //Do nothing
            alert("Please input proper PenId")
        }
        });
        axios.get(`${config.get('apiString')}pen/`)
        .then(res => {
        });
      };

    

      onSubmit = () => {
        //console.log('clicked');  
        //console.log(this.state.value);
        const val = {
          ID: this.state.value
        }
        //var L = val.ID.length;
        //DENNA KOD BEHÖVER FIXAS

         }
  
  
  
    render() {
      return <div className="inputLook"> 
      {this.props.children}
      
        <form align="center" onSubmit= {this.handleSubmit}>
        <div class="row">
        <div class="col">
           
            <input type="text" class="form-control" placeholder="Pennans ID" value={this.state.value} onChange={this.handleChange} />
            </div>
    </div>
        <div className="sub">
          <button type="submit" onClick={this.onSubmit} >Skicka</button>
        </div>
      </form> 
      </div>
  
    }
    
  }  
  export default withRouter (Input)