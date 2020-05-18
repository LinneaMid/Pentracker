import React from 'react'
import ShowPen from './components/showPen'
import HistoryText from './components/historyText'
import axios from 'axios';
import NameText from './components/nameText';
import InputSecond from './components/inputSecond';
import Maps from './components/map';
import config from 'react-global-configuration';
//import Map from './components/marker';




class penHistory extends React.Component {

  penId;
  resdata;
  
  UNSAFE_componentWillMount () {
    const { penId } = this.props.match.params;
    this.penId = penId;
    var tratt = this.penId.toUpperCase();
    axios.get(`${config.get('apiString')}pen/${tratt}`)
    .then(res => {
      //console.log(res);
      //console.log(res.data); 
      if (res.status == 200){
        this.resdata = res.data;
        //this.forceUpdate();
        //console.log(res.data);
      }
    }).catch(err => { this.props.history.push(`/`); });
  }

  render() {
    return <div className="logo">
    <h1 align="center">VÄLKOMMEN TILL GRUPPERA!</h1>
    <NameText/>
    <InputSecond/>
    <HistoryText/>
    <ShowPen PenId={this.penId}/>
    <Maps PenId={this.penId}/> 
    <p>Tack för att du är med och bidrar!</p>
    </div>
  }
}
export default penHistory