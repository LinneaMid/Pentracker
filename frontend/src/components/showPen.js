import React from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import config from 'react-global-configuration';




class ShowPen extends React.Component {


    componentDidMount() {
        // const { penId } = this.props.match.params;
        let penId = this.props.PenId;
        console.log(penId);
        
        axios.get(`${config.get('apiString')}pen/${penId}`)
        .then(res => {
            //console.log(res);                
            let listPen = res.data.inputs;
            this.items = listPen ? listPen.map((item, index) => {
            return <li key={index}>
            <div className="textShowPen">{item.name}</div>
            <div className="textShowPen">{item.date}</div>
          </li>
            }):null;            
            this.forceUpdate();
            // ReactDOM.render(<ShowPen/>, document.getElementsByClassName("showPen"))

        });       
    }


    render() {
        return <div className="showPen">
        
            <ul>
            <li>
                <div className="textShowPen">Namn</div>
                <div className="textShowPen">Datum</div>
            </li>
                {this.items}
            </ul>
        </div>
    }
}

export default ShowPen
