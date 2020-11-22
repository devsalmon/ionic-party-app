import React, { useState, useEffect} from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import {
    IonButtons,
  IonBackButton,
  IonPage,
  IonToolbar
} from '@ionic/react';
import '../App.css'

const MapContainer = () => {

    const [ currentPosition, setCurrentPosition ] = useState({lat:0, lng:0});
    
    const defaultCenter = {
        lat: 41.3851, lng: 2.1734
    }
  
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(function(position) {
            setCurrentPosition({
                lat: position.coords.latitude, 
                lng: position.coords.longitude
            }); 
        });
    })

    const onMarkerDragEnd = (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setCurrentPosition({
            lat: lat,
            lng: lng
        })
    };  

    const mapStyles = {        
        height: "100vh",
        width: "100%"
    };

  return (
    <IonPage>
    <IonToolbar>
      <IonButtons slot="start">
        <IonBackButton defaultHref="/create" />
      </IonButtons>
    </IonToolbar>
     <LoadScript googleMapsApiKey="AIzaSyAVvp3VEXlFr-G--hwhIWFPxj_taJdnUx8">     
      <GoogleMap mapContainerStyle={mapStyles} zoom={13} center={currentPosition ? currentPosition : defaultCenter}>
      {
        currentPosition ? 
          <Marker
          position={currentPosition}
          onDragEnd={(e) => onMarkerDragEnd(e)}
          draggable={true} /> :
          null
      } 
      </GoogleMap>
    </LoadScript>
    </IonPage>
  )
}

export default MapContainer;