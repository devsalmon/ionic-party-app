import React, { useState, useEffect} from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import {
  IonBackButton,
  IonPage, 
  IonToolbar, 
  IonButtons, 
  IonTitle,
  IonText,
  IonHeader,
} from '@ionic/react';
import { 
  chevronBackSharp
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

interface OtherProfileProps extends RouteComponentProps<{
    id: string;
}> {}

const OtherProfile: React.FC<OtherProfileProps> = ({match}) => {

    const [showMutualParties, setShowMutualParties] = useState(true);
    const [showFriends, setShowFriends] = useState(false);
    const [userName, setUserName] = useState("");

    useEffect(() => {
        firebase.firestore().collection('users').doc(match.params.id).get().then(doc => {
            let data = doc.data();
            setUserName(data && data.username);
        });
    }, [showFriends])


    const displayParties = () => {
      setShowMutualParties(true);
      setShowFriends(false);
    }

    const displayFriends = () => {
      setShowFriends(true);
      setShowMutualParties(false);
    }

    return(               
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
                <IonBackButton color="warning" defaultHref="/profile" icon={chevronBackSharp}/>
            </IonButtons>          
            <IonTitle>{userName ? userName : "error"}</IonTitle>   
          </IonToolbar> 
          <IonText>Mutual parties</IonText>     
        </IonHeader><br/><br/>

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
        <br/><br/><br/><br/><br/><br/>
      </IonPage>
    )
  }

export default withRouter(OtherProfile); 