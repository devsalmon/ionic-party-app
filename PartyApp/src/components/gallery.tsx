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

const Gallery = ({id, click}) => {
    // party card
    const [value, loading, error] = useCollection(
      firebase.firestore().collection('parties').doc(id).collection('pictures'),
    );  
    // const deletePhoto = async() => {
    //   await collectionRef.doc(doc.id).update({
    //     picture: firebase.firestore.FieldValue.delete()
    //   })
    //   .then(function() { 
    //   console.log("field successfully deleted!")})
    //   .catch(function(error) { 
    //   console.error("Error removing document: ", error); 
    // });  
    // }
    return(     
      <IonGrid>
        <IonRow>
          <IonButton onClick={click}>
            <IonIcon icon={chevronBackSharp} />
          </IonButton>     
        </IonRow>
          <IonSlides scrollbar={false} pager={true} options={{initialSlide: 1, preloadImages: true, loop: true}}>
            {value && value.docs.map(doc => {
              return(                        
                <IonSlide key={doc.id}>
                  <IonRow>
                    <IonImg src={doc.data().picture} />
                  </IonRow>     
                  <IonRow className="ion-padding">
                    <IonLabel>Taken at {doc.data().createdAt}</IonLabel>
                  </IonRow>   
                </IonSlide>
              )
            })}      
          </IonSlides>  
      </IonGrid>
    )
  } 

export default Gallery;