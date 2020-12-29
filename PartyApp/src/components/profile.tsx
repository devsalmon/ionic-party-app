import React, { useState, useEffect} from 'react';
import {
  IonIcon,
  IonButton,
  IonPage, 
  IonContent, 
  IonToolbar, 
  IonItem ,
  IonButtons, 
  IonTitle,
  IonText,
  IonImg,
  IonMenu,
  IonMenuButton,
  IonHeader,
  IonList,
  IonRouterOutlet,
  IonRefresher,
  IonRefresherContent
} from '@ionic/react';

import MemoryList from './memories';

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import { 
  logOutSharp,
  settingsSharp,
  chevronDownCircleOutline
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

const Profile: React.FC = () => {

    // Signs out of Party app.
    const signOut = async() => {
      // Sign out of Firebase.
      firebase.auth().signOut();
      //alert("YOU JUST SIGNED OUT")
    }

    var user = firebase.auth().currentUser

    return(   
      <>                 
        <IonMenu side="end" type="overlay" contentId="profilePage">
          <IonHeader>
            <IonToolbar>
              <IonTitle>Settings</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent class="list">
            <IonList class="list">      
              <IonButton href="/signin" onClick={() => signOut()}>
                Sign out              
              </IonButton> <br/>
              <IonButton>
                Change username              
              </IonButton> <br/>
              <IonButton>
                Change password              
              </IonButton>  
              <IonButton>
                Notifications
              </IonButton>          
              <IonButton>
                Help
              </IonButton>                 
            </IonList>
          </IonContent>
        </IonMenu>
        <IonRouterOutlet></IonRouterOutlet>
            
      <IonPage id="profilePage">
        <IonHeader>
          <IonToolbar>
            <IonTitle>{user.displayName}</IonTitle>          
            <IonButtons slot="end">
              <IonMenuButton class="top-icons">
                <IonIcon icon={settingsSharp}></IonIcon>
              </IonMenuButton>
            </IonButtons>          
          </IonToolbar>      
        </IonHeader>
{/*         
        <IonItem class="accordion-item"  button href="/people">
          <IonText>Friends: 99</IonText> <br/>
        </IonItem >

        <IonItem class="accordion-item"  button href="/people">
          <IonText>Parties attended: 9120</IonText> <br/>
        </IonItem >

        <IonItem class="accordion-item"  button href="/people">
          <IonText>Parties hosted: -3</IonText> <br/>
        </IonItem >  

        <IonItem class="accordion-item"  button href="/people">
          <IonText>Upcoming parties: 2</IonText> <br/>
        </IonItem >

        <IonItem class="accordion-item"  button href="/people">
          <IonText>Status: sesh gremlin</IonText> <br/>
        </IonItem >
        <br/><br/><br/><br/><br/>                      */}
        <MemoryList memoriesPage={false} />
      </IonPage>
    </>
    )
  }

export default Profile;