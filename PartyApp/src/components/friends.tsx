import React, { useState, useEffect} from 'react';
import {useDocument, useCollection} from 'react-firebase-hooks/firestore';
import {
  IonItem,
  IonButton,
  IonButtons,
  IonHeader, 
  IonContent, 
  IonToolbar, 
  IonTitle,
  IonIcon,
  IonList,
  IonText
} from '@ionic/react';
import { 
} from 'ionicons/icons';
import '../App.css'
import firebase from '../firestore'
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

const Friends: React.FC = () => {

    const [friends, setFriends] = useState([]);
    const [newFriends, setNewFriends] = useState(false);

    useEffect(() => {
        findFriends();
    }, [newFriends]) // only rerun if there are new friends

    var user = firebase.auth().currentUser.uid;    
    const friendsCollection = firebase.firestore().collection('friends');
    const usersCollection = firebase.firestore().collection('users');
    var tempFriends = []; // list for friend id's

    const findFriends = () => {
        // loop through friends list in the document of current user in friends collection    
        // and add all the id's into tempFriends
        friendsCollection.doc(user).get().then(doc => {
            let data = doc.data().friends;
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
        })
    }

    return(
        <IonContent>
            <IonList class="list">
                {friends && friends.map(friend => {
                    return(
                        <IonItem class="accordion-item" key={friend.id} button >
                            <IonText>{friend.name}</IonText>
                        </IonItem>
                    )
                })}
            </IonList>
        </IonContent>
    )
}

export default Friends;