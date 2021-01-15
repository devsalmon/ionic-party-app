import React, { useState, useEffect} from 'react';
import { Route, RouteComponentProps, Redirect, Link } from 'react-router-dom';
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
  IonRouterOutlet
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import MemoryList from './memories';
import OtherProfile from './otherprofile';

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

const Profile: React.FC<RouteComponentProps> = ({match}) => {

    const [showYourParties, setShowYourParties] = useState(true);
    const [showFriends, setShowFriends] = useState(false);

    const [friends, setFriends] = useState([]);
    const [newFriends, setNewFriends] = useState(false);

    useEffect(() => {
        findFriends();
    }, [newFriends]) // only rerun if there are new friends

    var user = firebase.auth().currentUser;    
    const friendsCollection = firebase.firestore().collection('friends');
    const usersCollection = firebase.firestore().collection('users');
    var tempFriends = []; // list for friend id's

    const findFriends = () => {
        // loop through friends list in the document of current user in friends collection    
        // and add all the id's into tempFriends
        friendsCollection.doc(user.uid).get().then(doc => {
          if (doc.exists) {
            let data = doc.data().friends && doc.data().friends;
            data && data.map(friend => {
                tempFriends.push(friend)
            })
            // loop through tempFriends and get all user documents of those id's, and add to friends array
            tempFriends && tempFriends.map(friend => {
                usersCollection.doc(friend).get().then(doc => {
                    let data = doc.data();
                    data && setFriends(friends => [
                        ...friends, 
                        {
                            name: data.name,
                            id: doc.id
                        }
                    ]);  
                });
            })  
          }              
        })
    }

    // Signs out of Party app.
    const signOut = async() => {
      // Sign out of Firebase.
      firebase.auth().signOut();
      //alert("YOU JUST SIGNED OUT")
    }

    const displayParties = () => {
      setShowYourParties(true);
      setShowFriends(false);
    }

    const displayFriends = () => {
      setShowFriends(true);
      setShowYourParties(false);
    }

    return(   
      <>              
        <IonRouterOutlet>
          <Route path={`${match.url}/users/:id`} component={OtherProfile} />
        </IonRouterOutlet>
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
              </IonButton><br/>  
              <IonButton>
                Notifications
              </IonButton><br/>          
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
          <IonItem className="ion-padding-bottom">
            <IonButton class={showYourParties ? "custom-button": "create-button"} onClick={() => displayParties()}>Your parties</IonButton>
            <IonButton class={showFriends ? "custom-button" : "create-button"} onClick={() => displayFriends()}>Friends</IonButton>
          </IonItem>               
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
        </IonItem >    */}
        {showFriends ? 
          <IonContent>
            <IonList class="list">
                {friends && friends.map(friend => {
                    return(
                        <IonItem class="accordion-item" key={friend.id} routerLink={"/profile/users/" + `${friend.id}`}>
                            <IonText>{friend.name}</IonText>
                        </IonItem>
                    )
                })}
            </IonList>
          </IonContent> : 
          null}
        {showYourParties ? 
        <MemoryList memoriesPage={false} />:
        null}
        <br/><br/><br/><br/><br/><br/>
      </IonPage>
    </>
    )
  }

export default Profile;