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
  IonHeader,
  IonList,
  IonRouterOutlet,
  IonRefresher,
  IonRefresherContent
} from '@ionic/react';
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

    const [parties, setParties] = useState([]);  

    useEffect(() => {  
      // useeffect hook only runs after first render so it only runs once
      displayParties();
      // this means display parties only runs once
    },
    []);

    const displayParties = () => {
      // get current user 
      var current_user = firebase.auth().currentUser.uid;
      // get the document of the current user from firestore users collection
      firebase.firestore().collection("users").doc(current_user).get().then(function(doc) {
        console.log(doc.data().myParties);  
        var i; // define counter for the for loop   
        // loop through all parties in the user's document as long as there are parties there
        if (doc.data().myParties) {
          for (i = 0; i < doc.data().myParties.length; i++) {              
            var curr_id = doc.data().myParties[i];  
            // get party of the curr_id from the user's document
            firebase.firestore().collection("parties").doc(curr_id).get().then(function(doc) {
              // setState to contian all the party documents from the user's document
              setParties(parties => [
                ...parties,
                {
                  id: curr_id,
                  doc: doc,
                }
              ]);
            })
          }
        }
      })        
    }
  
  
    return(
      //refreshing bit first. This just handles the requests once they have been made.
      <IonContent fullscreen={true}>
        {/* <IonRefresher slot="fixed" onIonRefresh={doRefresh} pullMin={50} pullMax={200}>
        <IonRefresherContent
          pullingIcon={chevronDownCircleOutline}
          refreshingSpinner="circles">
        </IonRefresherContent>
      </IonRefresher> */}
      {/* {reqs && reqs.map(req => 
          (<Request id={req.name} key={req.id}/>)
      )} */}
        <Accordion allowZeroExpanded={true} allowMultipleExpanded={true}>   
        {parties && parties.map(party_id => {
            const today = new Date();  
            let data = party_id.doc.data();
            // if the party is now, display in live parties with camera function
            if (moment(today).isBetween(data.dateTime, data.endTime)) {
              return(          
                  <>
                  <IonTitle color="danger">LIVE!</IonTitle>              
                  {/* <Party doc={party_id.doc} key={data.id + "live"} live={true} classname="live-item"/>               */}
                  <br/>
                  </>
                );                    
            } // if party is after today display it on the home page 
            if (moment(data.dateTime).isAfter(today)) {
              return( 
                <>
                {/* <Party key={data.id} doc={party_id.doc} live={false} classname="accordion-item"/> */}
                </>
              );                
            }        
        })}
        </Accordion> 
      </IonContent>   
      )
  

    var user = firebase.auth().currentUser;
    return(
      <IonPage>

            <IonMenu side="end" type="push">
      <IonHeader>
        <IonToolbar color="danger">
          <IonTitle>End Menu</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem>Menu Item</IonItem>
          <IonItem>Menu Item</IonItem>
          <IonItem>Menu Item</IonItem>
          <IonItem>Menu Item</IonItem>
          <IonItem>Menu Item</IonItem>
        </IonList>
      </IonContent>
    </IonMenu>
    <IonRouterOutlet></IonRouterOutlet>

        <IonToolbar>   
          <IonButtons slot="start">
             <IonButton href="/signin" class="top-icons" onClick={() => signOut()}>
              <IonIcon slot="icon-only" icon={logOutSharp} />
            </IonButton>
          </IonButtons>
          <IonTitle>{user.displayName}</IonTitle>
          
          <IonButtons slot="end">
            <IonButton class="top-icons">
              <IonIcon slot="icon-only" icon={settingsSharp} />
            </IonButton>
          </IonButtons>          
        </IonToolbar>

        <IonContent>

          {/* <IonItem class="accordion-item"  button href="/people">
            <IonText>Username: {user.displayName}</IonText> <br/>
          </IonItem >

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
          <br/><br/><br/><br/><br/>                */}
        </IonContent>
      </IonPage>
    )
  }

export default Profile;