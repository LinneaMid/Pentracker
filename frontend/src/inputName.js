import React from 'react';
import ReactDOM from 'react-dom';
import NameText from './components/nameText';
import InputSecond from './components/inputSecond';

class InputName extends React.Component {

  render() {
    return <div className="logo">
      <h1 align="center">VÄLKOMMEN TILL GRUPPERA!</h1>
      <NameText />
      <InputSecond />
    </div>;
  }
}

export default InputName
