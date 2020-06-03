import React from 'react';
import {
IonContent, 
IonHeader, 
IonPage, 
IonTitle, 
IonToolbar,
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

const arr = [
  {
    name: 'party1',
    id: 1
  }
]

const Home: React.FC = (props) => {
  return(
    <IonPage>
      <IonToolbar>
        <IonTitle className="ion-text-center">Upcoming parties</IonTitle>
      </IonToolbar>
      <IonContent className="ion-padding">
        <IonList>
          {arr.map(elem => (
            <IonItemSliding key = {elem.name}> 
              <IonItem>
                <IonAvatar>
                  <img src={'https://ionicframework.com/docs/demos/api/list/avatar-finn.png'} />
                </IonAvatar>
                <IonLabel className="ion-padding">
                  <h2>{elem.name}</h2>
                </IonLabel>
              </IonItem>
              <IonItemOptions side="end">
                <IonItemOption>See details</IonItemOption>
              </IonItemOptions> 
            </IonItemSliding> 
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  )
}

export default Home;