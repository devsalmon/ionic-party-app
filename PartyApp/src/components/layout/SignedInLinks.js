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
import Create from '../../pages/Create';
import Memories from '../../pages/Memories';
import Menu from '../Menu';

const SignedInLinks = () => {
    return(
      <IonPage>
      <Route path="/create" component={Create} exact />
      <Route path="/memories" component={Memories} exact />
      </IonPage>
    )
};

  export default SignedInLinks