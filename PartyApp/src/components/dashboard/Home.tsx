import React, { Component } from 'react';
import {
IonContent, 
IonHeader, 
IonPage, 
IonTitle, 
IonToolbar,
IonCol,
IonRow,
IonGrid,
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs, 
  IonText, 
  IonItem,
  IonList, 
  IonButton,
  IonItemOption,
  IonItemOptions,
  IonItemSliding, 
  IonAvatar, 
  IonButtons, 
  IonBackButton, 
} from '@ionic/react';
import { home, add, addCircle, logIn } from 'ionicons/icons';
import Notifications from './Notifications'
import PartyList from '../parties/PartyList'

class Home extends React.Component {
  render(){
  return(
    <IonPage>
      <IonToolbar>
        <IonTitle className="ion-text-center">Upcoming parties</IonTitle>
      </IonToolbar>
      <IonContent className="ion-padding">
      <IonGrid>
        <IonRow>
          <IonCol>
            <PartyList />
          </IonCol>
          <IonCol>
            <Notifications />
          </IonCol>
        </IonRow>  
      </IonGrid>
      </IonContent>
    </IonPage>
  )
  }
}

export default Home;