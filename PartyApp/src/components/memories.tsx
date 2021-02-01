import React, { useState, useEffect} from 'react';
import {
  IonText,
  IonItem,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
  IonButtons,
  IonButton,
  IonHeader,
  IonRow,
  IonGrid,
  IonSlides,
  IonSlide,
  IonCol,
  IonAvatar,
  IonMenuButton,
  IonItemDivider,
  IonLabel
} from '@ionic/react';
import firebase from '../firestore';
import moment from 'moment';

import Gallery from './gallery';
import Memory from './memory';

import { 
  chevronBackSharp,
  settingsSharp
} from 'ionicons/icons';
import '../App.css'
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

const MemoryList = ({memoriesPage}) => {

  const [yourParties, setYourParties] = useState([]);  
  const [attendedParties, setAttendedParties] = useState([]);  
  const [showAttendedParties, setShowAttendedParties] = useState(true);
  const [showYourParties, setShowYourParties] = useState(false);
  const [partyID, setPartyID] = useState<string>('');
  const [hostID, setHostID] = useState<string>('');
  const [inGallery, setInGallery] = useState(false);
  const [friend_no, setFriend_no] = useState<number>();
  var user = firebase.auth().currentUser;
  var currentuser = firebase.auth().currentUser.uid


  useEffect(() => {  
    // useeffect hook only runs after first render so it only runs once
    displayParties();
    //finds the number of friends you have.
    firebase.firestore().collection("friends")
    .doc(currentuser).get().then(function(doc) {
        if (doc.exists) {
          setFriend_no(doc.data().friends.length)
        }
      })    
    // this means find parties only runs once
  },
  []);  

  // if memory card clicked, go to gallery
  const enter = (partyid, hostid) => {
    setPartyID(partyid)
    setHostID(hostid)    
    setInGallery(true)
  }  

 const displayParties = () => {          

    // get your parties
    firebase.firestore().collection("users")
      .doc(currentuser).collection("myParties").get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          let today = new Date();
          let data = doc.data();          
          // if party is in the future and party isn't already in the state 
          var alreadyInYP = yourParties.some(item => doc.id === item.id);
          if (moment(today).isAfter(data.dateTime) && !alreadyInYP) { 
            setYourParties(parties => [
              ...parties, 
              {
                id: doc.id,
                data: doc.data()
              }              
            ]);
          } 
        })
      })

    // get attended parties
    firebase.firestore().collection("users")
      .doc(currentuser).get().then(doc => {
          let today = new Date();
          let data = doc.data();
          if (data.acceptedInvites) {
            for (var i=0; i < data.acceptedInvites.length; i++) {
              firebase.firestore().collection("users")
                .doc(data.acceptedInvitesFrom[i]).collection("myParties").doc(data.acceptedInvites[i]).get().then(partydoc => {
                  // if party is in the future and party isn't already in the state 
                  var alreadyInAP = attendedParties.some(item => partydoc.id === item.id);
                  if (moment(today).isAfter(partydoc.data().endTime) && !alreadyInAP) {
                    // if party is live
                    setAttendedParties(parties => [
                      ...parties,
                      {
                        id: partydoc.id,
                        data: partydoc.data()
                      }
                    ])            
                  }
              })
            }                   
          }
    });      
  }


  const displayYourParties = () => {
    setShowYourParties(true);
    setShowAttendedParties(false);
  }

  const displayAttendedParties = () => {
    setShowAttendedParties(true);
    setShowYourParties(false);
  }

  if (inGallery) {
    return(
        <>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton color="warning" fill="clear" onClick={() => setInGallery(false)}>
              <IonIcon icon={chevronBackSharp} />
            </IonButton>
          </IonButtons>
          <IonTitle>Memories</IonTitle>
          <IonButtons slot="end">
            <IonButton disabled></IonButton>
          </IonButtons>
        </IonToolbar>
        <Gallery hostid={hostID} partyid={partyID} key={partyID}/>
        </>
      )
  } else {
    return(
      <>
        { // if in memory page, show the toolbar with memories, otherwise don't
          memoriesPage ?
          <IonHeader>
            <IonToolbar>
              <IonTitle size="large">My Parties</IonTitle>
            </IonToolbar>
            <IonItem class="accordion-item">
              <IonGrid>
                <IonRow>
                  <IonCol size="3">
                    <IonAvatar>
                      <img src={user.photoURL ? user.photoURL : "https://img.favpng.com/18/24/16/user-silhouette-png-favpng-4mEnHSRfJZD8p9eEBiRpA9GeS.jpg"} />
                    </IonAvatar>                   
                  </IonCol>
                  <IonCol size="9"> 
                    <IonText>{user.displayName}</IonText><br/>
                    <IonText class="white-text">{friend_no} FRIENDS</IonText>       
                  </IonCol>      
                </IonRow>      
              </IonGrid> 
            </IonItem><br/>                      
          </IonHeader>
          :
          null
        }
        <IonContent fullscreen={true}>
        <IonItem className="ion-padding-bottom">
          <IonButton class={showAttendedParties ? "custom-button" : "create-button"} onClick={() => displayAttendedParties()}>Attended</IonButton>
          <IonButton class={showYourParties ? "custom-button": "create-button"} onClick={() => displayYourParties()}>Hosted</IonButton>
        </IonItem> 
        {showYourParties ?           
          (yourParties.length === 0 ?
          <><br/><br/><IonText class=" white-text ion-padding-start"> No hosted parties yet..</IonText></> : 
          yourParties.map(doc => {
            return(<Memory id={doc.id} data={doc.data} key={doc.id} click={() => enter(doc.id, doc.data.hostid)}/>)          
          })) : null
        }
        {showAttendedParties ?
          (attendedParties.length === 0 ?
          <><br/><br/><IonText class="white-text ion-padding-start">No attended parties yet..</IonText></> :          
          attendedParties.map(doc => {
            return(<Memory id={doc.id} data={doc.data} key={doc.id} click={() => enter(doc.id, doc.data.hostid)}/>)          
          })) :
          null
        }              
        </IonContent>
      </>
    )
  }
}

export default MemoryList;