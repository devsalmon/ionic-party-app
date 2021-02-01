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
  IonPopover,
  IonInput,
  IonMenuButton,
  IonHeader,
  IonAvatar,
  IonAlert,
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
    const [usernamePopover, setUsernamePopover] = useState(false); //popover to change username
    const [newUsername, setNewUsername] = useState('');
    const [passwordPopover, setPasswordPopover] = useState(false); //popover to change password
    const [deleteAccPopover, setDeleteAccPopover] = useState(false); //popover to change password
    const [oldPassword, setOldPassword] = useState(''); //popover to change username
    const [newPassword, setNewPassword] = useState(''); //popover to change username
    const [verifyNewPassword, setVerifyNewPassword] = useState(''); //popover to change username
    const [passwordError, setPasswordError] = useState('');

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
                            name: data.username,
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

    const updateUsername = () => {
      setPasswordError('');
      user = firebase.auth().currentUser
      user.updateProfile({
        displayName: newUsername
      });
      firebase.firestore().collection('users').doc(user.uid).update({
        username: newUsername,  
      }).then(() => {
        setUsernamePopover(false);
        setNewUsername('');
      })    
    }

    const updatePassword = () => {
      setPasswordError('');
      user = firebase.auth().currentUser
      const credential = firebase.auth.EmailAuthProvider.credential(
        user.email, 
        oldPassword
      );            
      if (newPassword !== verifyNewPassword) {
        setPasswordError("passwords don't match");
      } else {        
        // Now you can use that to reauthenticate
        user.reauthenticateWithCredential(credential).then(function() {
          user.updatePassword(newPassword).then(function() {
            setPasswordPopover(false);
            setOldPassword('');
            setNewPassword('');
            setVerifyNewPassword('');
          }).catch(function(error) {
            setPasswordError(error.message);
          });        
        }).catch(function(error) {
          setPasswordError(error.message);
        });    
      } 
    } 

    const deleteAccount = () => {
      var user = firebase.auth().currentUser;
      user.delete().then(function() {
      }).catch(function(error) {
      });      
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
              <IonButton onClick={() => setUsernamePopover(true)}>
                Change username              
              </IonButton> <br/>
              <IonButton onClick={() => setUsernamePopover(true)}>
                Change photo             
              </IonButton> <br/>              
              <IonButton onClick={() => setPasswordPopover(true)}>
                Change password              
              </IonButton><br/>
              <IonButton onClick={() => setDeleteAccPopover(true)}>
                Delete Account             
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
            <IonButtons slot="start">
              <IonAvatar>
                <img src={user.photoURL ? user.photoURL : "https://img.favpng.com/18/24/16/user-silhouette-png-favpng-4mEnHSRfJZD8p9eEBiRpA9GeS.jpg"} />
              </IonAvatar>             
            </IonButtons>
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
        <IonPopover
          cssClass="popover"        
          isOpen={usernamePopover}
          onDidDismiss={() => setUsernamePopover(false)}
        >
          <IonInput 
          class="create-input" 
          value={newUsername} 
          onIonChange={e => setNewUsername(e.detail.value!)} 
          placeholder="New Username" clearInput>            
          </IonInput>
          <IonButton onClick={() => updateUsername()}>Done</IonButton>             
        </IonPopover>
        <IonPopover
          cssClass="popover"        
          isOpen={passwordPopover}
          onDidDismiss={() => setPasswordPopover(false)}
        >
          <IonInput 
          class="create-input" 
          value={oldPassword} 
          onIonChange={e => setOldPassword(e.detail.value!)} 
          placeholder="Old Password" clearInput>            
          </IonInput>
          <IonInput 
          class="create-input" 
          value={newPassword} 
          onIonChange={e => setNewPassword(e.detail.value!)} 
          placeholder="New Password" clearInput>            
          </IonInput>
          <IonInput 
          class="create-input" 
          value={verifyNewPassword} 
          onIonChange={e => setVerifyNewPassword(e.detail.value!)} 
          placeholder="Re-enter New Password" clearInput>            
          </IonInput>              
          <IonText>{passwordError}</IonText>                
          <IonButton onClick={() => updatePassword()}>Done</IonButton>             
        </IonPopover>    
        <IonPopover
          cssClass="popover"        
          isOpen={deleteAccPopover}
          onDidDismiss={() => setDeleteAccPopover(false)}
        >
          <IonText className="ion-padding">Delete Account?</IonText><br/>
          <IonText class="white-text">You won't be able to recover this account</IonText><br/>
          <IonButton onClick={()=>setDeleteAccPopover(false)}>
            Cancel
          </IonButton>            
          <IonButton onClick={()=>deleteAccount()}>
            Delete
          </IonButton>   
        </IonPopover>         
        <br/><br/><br/><br/><br/><br/>
      </IonPage>
    </>
    )
  }

export default Profile;