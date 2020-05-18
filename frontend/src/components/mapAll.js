import ReactMapboxGl, { 
    Layer, 
    Feature, 
    ScaleControl,
    ZoomControl,
    RotationControl,
    GeoJSONLayer,
    Popup} from "react-mapbox-gl";
import React from "react";
import * as MapboxGL from 'mapbox-gl';
import axios from 'axios';
import config from 'react-global-configuration';

const Map = ReactMapboxGl({
accessToken:
'pk.eyJ1IjoiZ3J1cHBlcmFtYXAiLCJhIjoiY2s3a2ozN3plMDdtbzNrcDk2MTY3eW8yNyJ9.UbWeQISmy9Gh8AhEqfZiQw'

});
    
class MapAll extends React.Component {
    
    componentDidMount() {
        //let penId = this.props.PenId;
        //console.log(penId);
        
         axios.get(`${config.get('apiString')}pen/`)
         .then(res => {
            //console.log(res);   
             //console.log(res.data);    
            //get marker
            let coords = res.data;

            const officeCoords = {
              locationLONG: 18.055318,
              locationLAT: 59.337333
            };
            coords.unshift(officeCoords)
            //let coords = res.data.inputs;
            if (coords != undefined) {
            this.items = coords.filter((item, index)=>item.inputs).map((item, index) =>{
              //console.log(item);
              return <Feature key={index} coordinates={[item.inputs[0].locationLONG , item.inputs[0].locationLAT]}/>
            });
            //console.log(this.items)
                  }
            this.forceUpdate(); 

            // for(res.data in penId) {
            //     <Feature coordinates={[locationLONG, locationLAT]} />;            
            //   }

        });       
    }

 

  render() {
    const coordinate=[18.055318, 59.337333];
    return (
<Map
    center={coordinate}
    zoom={[2]}

    style="mapbox://styles/mapbox/streets-v9"
     containerStyle={
        {
       
        height: '80vh',
        width: '80vw'
        }
  }

  
>

    {/* Controls*/}
    <ScaleControl/>
    <ZoomControl/> 
    <RotationControl style={{top:80}}/>

  

<Layer
   type="circle"
   id="marker"

   paint={{
     "circle-color": "#000000",
     "circle-stroke-width": 1.5,
     "circle-stroke-color": "#C7FF7F",
     "circle-stroke-opacity": 1
   }}
>
   <Feature coordinates={coordinate} /> 

   {/* this.items... blockar ut feature. prova med den igen när koden för att få
   ut från db fungerar rätt */}

  {/* {this.items && this.items.inputs != null? this.items.inputs:<div></div> }  */}
  {this.items}

  </Layer>

    <Popup
        // coordinates={[18.055318, 59.337333]}
        coordinates={coordinate}

        offset={{
        }}>
        <h1>Gruppera</h1>
        <p>(Origin of pen)</p>
    </Popup>

</Map>
      
    )
  }
}


export default MapAll