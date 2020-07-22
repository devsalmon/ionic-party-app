import React, { useState, useEffect} from 'react';
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion';
import { Route, Redirect } from 'react-router-dom';
import {useDocument, useCollection} from 'react-firebase-hooks/firestore';
import {
  IonIcon,
  IonButton,
  IonPage, 
  IonContent, 
  IonToolbar, 
  IonSearchbar,
  IonItem,
  IonAvatar,
  IonLabel,
  IonButtons, 
  IonTitle,
  IonRow,
  IonCol,
  IonText,
  IonLoading,
  IonAlert,
  IonImg
} from '@ionic/react';
import { 
  personAddSharp,  
  logOutSharp,
  createSharp,
  starSharp,
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

const People: React.FC = () => {

    // Signs out of Party app.
    const signOut = async() => {
    // Sign out of Firebase.
    firebase.auth().signOut();
    //alert("YOU JUST SIGNED OUT")
    }

    var user = firebase.auth().currentUser;
    return(
      <IonPage>
        <IonToolbar>        
          <IonButtons slot="start">
            <IonButton href="/signin" class="top-icons" onClick={() => signOut()}>
              <IonIcon slot="icon-only" icon={logOutSharp} />
            </IonButton>
          </IonButtons>
          <IonTitle>username</IonTitle>
          <IonButtons slot="end">
            <IonButton class="top-icons" href='/users'>
              <IonIcon slot="icon-only" icon={personAddSharp} />
            </IonButton>       
          </IonButtons>
        </IonToolbar>
        <IonContent>
          <IonItem button href="/people">
            <IonRow>
              <IonCol size="10">
                  <IonText>{user.displayName}</IonText> <br/>
                  <IonIcon color="warning" icon={starSharp}/>
                  <IonText>  4.8</IonText>
              </IonCol>
              <IonCol size="2">
                <IonButton class="custom-button">
                  <IonIcon icon={createSharp} />
                </IonButton> 
              </IonCol>
            </IonRow>          
          </IonItem> <br/>
          <IonText>Requests</IonText>
          <IonItem button>
            <IonText>Nick</IonText> <br/>
            <IonIcon color="warning" icon={starSharp}/>
            <IonText>  4.2</IonText>    
          </IonItem> 
          <IonItem button>
            <IonText>Alex</IonText> <br/>
            <IonIcon color="warning" icon={starSharp}/>
            <IonText>  4.1</IonText>    
          </IonItem>        
          <br/>
          <IonText>Friends</IonText>     
          <IonItem button>
            <IonText>Nick</IonText> <br/>
            <IonIcon color="warning" icon={starSharp}/>
            <IonText>  4.2</IonText>
          </IonItem> 
          <IonItem button>
            <IonText>Alex</IonText> <br/>
            <IonIcon color="warning" icon={starSharp}/>
            <IonText>  4.1</IonText>
          </IonItem> 
          <br/><br/><br/><br/><br/>               
        </IonContent>
      </IonPage>
    )
  }

export default People;