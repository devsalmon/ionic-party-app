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

const Users: React.FC = () => {

  const collectionRef = firebase.firestore().collection("friend_requests");
  const searchClient = algoliasearch('N5BVZA4FRH', '10173d946e2ba5aa9ba4f9ae445cef48');
  const index = searchClient.initIndex('Users');
  const [hits, setHits] = useState([]);
  const [query, setQuery] = useState('');
  const [addDisabled, setAddDisabled] = useState(false)
  const [cancelDisabled, setCancelDisabled] = useState(true)

  async function search(query) {
    const result = await index.search(query);
    setHits(result.hits);
    setQuery(query)    
  }
//  basically if in friend_requests, if under ur id, u have another persons id 
//  (in a collection) w a doc with request_status equal to 'received' then that
//  person's id (the collection) should be used to get the persons profile and
//  display it in inbox w "accept request". To check that u have a new friend
//  request, I think we need to use an onSnapshot function which would be always
//  listening for a new entry in friend requests under ur id i think. If you get
//  that working u can attach the accept request function to the accept button.
  const addFriend = (objectID) => {
    
    //var currentState = "not_friends"
    //var disabledState = false
    var receiver_user_id = objectID
    var sender_user_id = firebase.auth().currentUser.uid
    //console.log(receiver_user_id)

    //create doc with sender's id and adds receiver's id to collection.
    collectionRef.doc(sender_user_id).collection(receiver_user_id).add(
      {request_status: 'sent'})

      //if successful
      .then(function(docRef) {
        //console.log("Document written with ID: ", docRef.id);
        //if successful, create doc w receiver's id and add sender's id to collection
        collectionRef.doc(receiver_user_id).collection(sender_user_id).add(

          {request_status: 'received'})
          
          //if successful
          .then(function(docRef) {
            //currentState = "request_received"
            setAddDisabled(true); //disables add friend button
            setCancelDisabled(false); //enalbes cancel request button
          })

          //if unsuccessful
          .catch(function(error) {
            console.error("Error adding document: ", error);
        }); 
      })

    //if unsuccessful
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });

  }

  const resetButtons = () => {
    setAddDisabled(false); //disables add friend button
    setCancelDisabled(true); //enalbes cancel request button
  }

  if (hits && query !== "" && query !== " ") {
    return(
      <IonPage>
        <IonToolbar>   
        <Accordion>      
            <AccordionItem className="accordion-item">
              <AccordionItemHeading>
                <AccordionItemButton>
                  <IonRow>
                    <IonCol size="3">
                      <IonAvatar>
                        <img/>
                      </IonAvatar>
                    </IonCol>
                    <IonCol size="5">
                    <IonButton href='/people'>Edit</IonButton>
                      <IonText>Me</IonText> <br/>
                      <IonText class="white-text">Edit Profile</IonText>
                    </IonCol>
                  </IonRow>
                </AccordionItemButton>
              </AccordionItemHeading>
            </AccordionItem>)
          </Accordion>
          <IonSearchbar class="searchbar" onIonChange={e => search(e.detail.value!)}></IonSearchbar>
        </IonToolbar>
        <IonContent>
          <Accordion>      
            {hits.map(hit => 
            <AccordionItem className="accordion-item" key={hit.objectID}>
              <AccordionItemHeading>
                <AccordionItemButton>
                  <IonRow>
                    <IonCol size="3">
                      <IonAvatar>
                        <img src={hit.photoUrl} />
                      </IonAvatar>
                    </IonCol>
                    <IonCol size="5">
                      <IonText>{hit.name}</IonText> <br/>
                      <IonText class="white-text">Friends since ....</IonText>
                    </IonCol>
                    <IonCol>
                      <IonButton  class="custom-button"  disabled={addDisabled} onClick={() => addFriend(hit.objectID)}>
                        <IonIcon src="assets/icon/Create.svg" />
                      </IonButton>
                      <IonButton class="custom-button" disabled={cancelDisabled} onClick={resetButtons}>X</IonButton>
                    </IonCol>
                  </IonRow>
                </AccordionItemButton>
              </AccordionItemHeading>
            </AccordionItem>)}
          </Accordion>
        </IonContent>
      </IonPage>    
    )
  } 
  else {
    return(
      <IonPage>
        <IonToolbar>   
          <IonSearchbar class="searchbar" onIonChange={e => search(e.detail.value!)}></IonSearchbar>
        </IonToolbar>
        <IonContent>

        </IonContent>
      </IonPage>
    )}}

export default Users;