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

    var user = firebase.auth().currentUser;    
    const collectionRef = firebase.firestore().collection('users')
    

    collectionRef.doc(user).get().then(doc => {
        var tempFriends = [];
        let data = doc.data() && doc.data()
        for (i = 0; i < data.friends.length; i++) {
            tempFriends.push(data.friends[i])
        }
        setFriends(tempFriends);
    })

    return(
        <IonContent>
            <IonList>
                {friends && friends.map(friend => {
                    return(
                        <IonItem>
                            <IonText>{friend.name}</IonText>
                        </IonItem>
                    )
                })
            </IonList>
        </IonContent>
    )
}

export default Friends;