import React, { useState, useEffect} from 'react';
import App from '../App';
import { GoogleMap, LoadScript, Marker, StandaloneSearchBox, Data,   DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import {
  IonButtons,
  IonIcon,
  IonPage,
  IonToolbar,
  IonInput,
  IonRadioGroup,
  IonRadio,
  IonItem,
  IonListHeader,
  IonLabel,
  IonButton,
  IonContent
} from '@ionic/react';
import { 
  chevronBackSharp,  
} from 'ionicons/icons';
import '../App.css'

const MapContainer = ({styles}) => {

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

  function hideTab() {
    const tabBar = document.getElementById('appTabBar');
    tabBar.style.display = 'none';
  }
  // show tabs again when create page is exited
  function showTab() {        
    const tabBar = document.getElementById('appTabBar');
    tabBar.style.display = 'flex';
  }      

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

  const onMapLoad = (map) => {
    console.log('map.data: ', map.data)
    // map.data.loadGeoJson('/geo.json')
  }

  const onDataLoad = (data) => {
    console.log('data: ', data)
  }

  const dataOptions = {
    controlPosition: 'TOP_LEFT',
    controls: ['Point'],
    drawingMode: 'Point', //  "LineString" or "Polygon".
    featureFactory: (geometry) => {
      console.log('geometry: ', geometry)
    }
  }  

  return (
    <IonPage>
      {hideTab()}
      <IonToolbar>
        <IonButtons class="create-button" slot="start">
          <IonButton onClick={()=>showTab()} href="/create">
            <IonIcon slot="icon-only" icon={chevronBackSharp}></IonIcon>
          </IonButton>
        </IonButtons>
      </IonToolbar>
      <IonContent fullscreen={true}>
        <LoadScript googleMapsApiKey="AIzaSyAVvp3VEXlFr-G--hwhIWFPxj_taJdnUx8"  libraries={["places"]}>  
          <GoogleMap 
            mapContainerStyle={mapStyles} 
            zoom={13} 
            center={currentPosition ? currentPosition : defaultCenter}
            onLoad = {onMapLoad}
          >
          {
            currentPosition ? 
              <Marker
              position={currentPosition}
              onDragEnd={(e) => onMarkerDragEnd(e)}
              draggable={true} /> :
              null
          } 
          <StandaloneSearchBox>
            <IonInput class="create-input" placeholder="Search"></IonInput>
          </StandaloneSearchBox>      
          <Data onLoad={onDataLoad} options={dataOptions} />
          </GoogleMap>
        </LoadScript>
      </IonContent>
    </IonPage>
  )
}

export default MapContainer;