import React from 'react';
import { Redirect, Route } from 'react-router-dom'
import { 
  IonMenu,
  IonPage,
  IonHeader, 
  IonContent, 
  IonToolbar, 
  IonTitle, 
  IonList, 
  IonItem, 
  IonRouterOutlet,
  IonApp, 
  IonMenuToggle,
  IonIcon,
  IonLabel,
  IonTabs,
  } from '@ionic/react';
import Create from '../parties/Create';
import Memories from '../parties/Memories';

const SignedOutLinks = () => {
    return(
      <IonList>
        <IonMenuToggle>
        <IonItem href='/signin'>
          <IonLabel>Log In</IonLabel>
        </IonItem>
        <IonItem href='/signup'>
          <IonLabel>Sign Up</IonLabel>
        </IonItem>
        </IonMenuToggle>
      </IonList>
)
};

  export default SignedOutLinks