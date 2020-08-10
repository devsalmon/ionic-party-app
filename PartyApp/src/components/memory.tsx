import React, { useState, useEffect} from 'react';
import {
  IonIcon,
  IonGrid,
  IonButtons, 
  IonRow,
  IonCol,
  IonToast,
  IonButton,
  IonText,
  IonLoading,
  IonAlert,
  IonBackButton, 
  IonItem,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { 
} from 'ionicons/icons';
import '../App.css'
import firebase from '../firestore'
import moment from 'moment'
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
/* Theme variables */
import '../variables.css';
import { memory } from 'console';

const Memory = ({doc, click}) => {
  // party card  

  let data = doc.data();
  
  return(
    <IonItem button onClick={click} className="accordion-item">
    <IonGrid>
      <IonRow>
        <IonCol size="12">
          <IonText>{data.title}</IonText>
        </IonCol>
      </IonRow>               
      <IonRow>
        <IonCol size="12">
          <IonText class="white-text">{data.date}<br/></IonText> 
          <IonText class="white-text">Hosted By {data.host}</IonText>
        </IonCol>
      </IonRow>
      </IonGrid>
    </IonItem>        
  )
}

export default Memory;