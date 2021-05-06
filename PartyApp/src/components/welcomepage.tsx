import React from 'react';
import {
  IonButton,
  IonPage,
  IonContent, 
  IonText,
  IonImg,
  IonToolbar,
  IonButtons,
  IonIcon
} from '@ionic/react';
import { 
  eyeOutline,
  search,
  personCircle
} from 'ionicons/icons';
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

const WelcomePage: React.FC = () => {

  return (
    <IonPage>
      <IonToolbar>
    <IonButtons slot="end">
      <IonButton>Help</IonButton>
    </IonButtons>
    </IonToolbar>
      <IonContent class="welcome-page-content">   
        {/* <IonImg src={} /> */}
        <IonText>*Add logo on top of MOTIVE title*</IonText><br/>
        <IonText class="welcome-title">MOTIVE</IonText><br/>
        <IonText>*Add description* e.g. An app for organizing parties with friends, and capturing memories...</IonText><br/>
        <IonButton href="signup" class="custom-button">Get Started</IonButton>
        <IonButton href="signin" class="custom-button">Already have an account? Sign In</IonButton>
      </IonContent>
    </IonPage>
  )
}

export default WelcomePage;