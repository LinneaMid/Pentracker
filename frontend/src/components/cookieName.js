import React from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import {
  withRouter
} from 'react-router-dom';
import cookie from 'react-cookies'
import config from 'react-global-configuration';
class fillIn extends React.Component {
  fillIn(){
    var cookieExists = cookie.get('apistring');
    if (cookieExists != null)
    for (var i = 0; i < cookie.length; i++) {
        if (cookie[0] == 'Name') {
            document.TestForm.Name.value = cookie[1];
        }
        }
    }

}

export default withRouter(fillIn) 