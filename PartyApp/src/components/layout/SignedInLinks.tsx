import React from 'react';
import { Redirect, Route } from 'react-router-dom'
import { 
  IonHeader, 
  IonContent, 
  IonTitle, 
  IonList, 
  IonItem, 
  IonRouterOutlet,
  IonApp, 
  IonIcon,
  IonLabel,
  IonMenuToggle
  } from '@ionic/react';
import Create from '../parties/Create';
import Memories from '../parties/Memories';
import { home, add, addCircle, logIn, personCircleOutline, peopleCircleOutline, starSharp, triangle } from 'ionicons/icons';


class Page {
  title: string = '';
  url: string = '';
  icon: string = '';
};
const appPages: Page[] = [
  {title: 'Upcoming parties', url: '/', icon: home},
  {title: 'Create a party', url: '/create', icon: addCircle},
  {title: 'Login page', url: '/login', icon: logIn},
  {title: 'Memories', url: '/memories', icon: peopleCircleOutline},
]

const SignedInLinks = () => {
    return(
      <IonList>
        <IonItem href='/'>
          <IonLabel>Log Out</IonLabel>
        </IonItem>
        <IonItem href='/'>
          <IonIcon icon={personCircleOutline}></IonIcon>
        </IonItem>
        <IonItem color="primary">
          <IonIcon slot="start" icon={starSharp}/>
          <IonLabel>Guest rating: </IonLabel>
        </IonItem>
        {appPages.map((appPage, index) => {
        return (
          <IonMenuToggle key={index} auto-hide="false">
          <IonItem color="primary" href={appPage.url}>
              <IonIcon slot="start" icon={appPage.icon} />
              <IonLabel>{appPage.title}</IonLabel>
          </IonItem>
          </IonMenuToggle>
        );
        })}
      </IonList>
)
};

  export default SignedInLinks