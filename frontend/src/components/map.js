import ReactMapboxGl, {
  Layer,
  Feature,
  ScaleControl,
  ZoomControl,
  RotationControl,
  GeoJSONLayer,
  Popup
} from "react-mapbox-gl";
import React from "react";
import * as MapboxGL from 'mapbox-gl';
import axios from 'axios';
import config from 'react-global-configuration';
const Map = ReactMapboxGl({
  accessToken:
    'pk.eyJ1IjoiZ3J1cHBlcmFtYXAiLCJhIjoiY2s3a2ozN3plMDdtbzNrcDk2MTY3eW8yNyJ9.UbWeQISmy9Gh8AhEqfZiQw'
});
// const geojson = {
//     'type': 'FeatureCollection',
//     'features': [
//       {
//         'type': 'Feature',
//         'geometry': {
//           'type': 'LineString',
// 'coordinates': [
//   [
//     18.063240,
//     59.334591
//   ],
//{this.line}
// [
//     29.371532589441756,
//     40.896189603433761
// ],
// [
//     -77.01239,
//      38.91275
// ],
// ]
//       }
//     }
//   ]
// };
// const linePaint = MapboxGL.LinePaint = {
//   'line-color': '#8BE800',
//   'line-width': 5
// };
class Maps extends React.Component {
/*constructor(props) {
  super(props);
  console.log(props);
}*/
  componentDidMount() {
    let penId = this.props.PenId;
    
        axios.get(`${config.get('apiString')}pen/${penId}`)
        .then(res => {
            //console.log(res);   
            //För push till linnea
            //get marker
            let coords = res.data.inputs;
            // coords.unshift([18.055318, 59.337333]);
            // coords.locationLONG.unshift(18.055318);
            // coords.locationLAT.unshift(59.337333);
            const officeCoords = {
              locationLONG: 18.055318,
              locationLAT: 59.337333
            };
            coords.unshift(officeCoords)
            this.items = coords.map((item, index) =>{
              //console.log(item)
              if(item.locationLONG) {
              return <Feature key={index} coordinates={[item.locationLONG , item.locationLAT]}/>
            }}).filter((item, index)=>item);
            //console.log(this.items);
            this.line = coords.filter((line)=>line.locationLONG).map((line) =>{
              return [line.locationLONG, line.locationLAT]
            });
            // this.line = coords.map((line) =>{
            //   return [line.locationLONG, line.locationLAT],
            //   coords.unshift([18.055318, 59.337333]);
            // }); 
            this.forceUpdate(); 

            // for(res.data in penId) {
            //     <Feature coordinates={[locationLONG, locationLAT]} />;            
            //   }
        });       
  }
  render() {
    const coordinate = [18.055318, 59.337333];
    // let linecoord={this.line};
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
        onStyleLoad={map => {
          map.addLayer({
            id: 'route',
            type: 'line',
            source: {
              type: 'geojson',
              data: {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'LineString',
                  coordinates:
                    this.line,
                }
              }
            },
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#8BE800',
              'line-width': 4
            }
          });
        }}
      >
        {/* <GeoJSONLayer
          data={geojson}
          linePaint={linePaint}
        /> */}
        {/* Controls*/}
        <ScaleControl />
        <ZoomControl />
        <RotationControl style={{ top: 80 }} />
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
   {/* <Feature coordinates={coordinate} />  */}
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
export default Maps