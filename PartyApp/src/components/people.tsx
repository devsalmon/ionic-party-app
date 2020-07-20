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
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs, 
  IonItem,
  IonList, 
  IonButton,
  IonPage,
  IonHeader, 
  IonContent, 
  IonToolbar, 
  IonButtons, 
  IonMenuButton,
  IonTitle,
  IonSearchbar,
  IonRow,
  IonCol,
  IonInput,
  IonModal, 
  IonDatetime,
  IonCheckbox, 
  IonGrid,
  IonTextarea,
  IonItemGroup,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonMenu,
  IonMenuToggle,
  IonText,
  IonToast,
  IonCardSubtitle,
  IonFooter,
  IonAvatar,
  IonPopover,
  IonRippleEffect,
  IonLoading,
  IonAlert,
  IonImg,
  IonSlides,
  IonSlide,
  IonBackButton, 
  createAnimation
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { 
  home, 
  addCircle, 
  personAddSharp,  
  peopleCircleOutline, 
  arrowDownCircle, 
  arrowForwardCircle, 
  starSharp,  
  imageSharp,
  logOutSharp,
  notificationsSharp,
  personCircleSharp,
  cameraSharp,
  createSharp,
  chatbubblesSharp,
  trashBinSharp,
  cloudUploadSharp,  
  chevronBackSharp
} from 'ionicons/icons';
import {Plugins} from '@capacitor/core';
import {useCamera} from '@ionic/react-hooks/camera';
import {CameraResultType, CameraSource} from '@capacitor/core';
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
import algoliasearch from 'algoliasearch/lite';
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
          <Accordion allowZeroExpanded={true} allowMultipleExpanded={true}>
            <AccordionItem className="accordion-item">
              <AccordionItemHeading>
                <AccordionItemButton className="ion-padding">
                  <IonRow>
                    <IonCol size="8">
                      <IonText>{user.displayName}</IonText>
                      <IonText>(Username)</IonText>
                    </IonCol>
                    <IonCol className="ion-text-right">
                      <IonButton class="custom-button">
                        <IonIcon icon={createSharp} />
                      </IonButton> 
                    </IonCol>
                  </IonRow>
                </AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel>  
                  <IonButton class="custom-button" expand="block">
                    View profile
                  </IonButton>   
              </AccordionItemPanel>          
            </AccordionItem>
          </Accordion>  
          <IonText>Requests and friends to be done..........</IonText>
        </IonContent>
      </IonPage>
    )
  }

export default People;