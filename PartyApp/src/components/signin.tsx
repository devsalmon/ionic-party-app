import React, { useState, useEffect} from 'react';
import firebase from '../firestore';
import {
  IonItem,
  IonButton,
  IonPage,
  IonContent, 
  IonToolbar, 
  IonButtons, 
  IonIcon,
  IonTitle,
  IonInput, 
  IonText,
  IonPopover,
  IonLabel,
  IonRow,
  IonCol
} from '@ionic/react';
import { 
  eyeOutline,
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

const SignIn: React.FC = () => {

  // Will try to use previously entered email, defaults to an empty string
  const [email, setEmail] = useState(
    window.localStorage.getItem("emailForSignIn") || ""
  );
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [fieldsMissing, setFieldsMissing] = useState(false);

  const clearInputs = () => {
    setEmail('');
    setPassword('');
  }

  const clearErrors = () => {
    setEmailError('');
    setPasswordError('');  
    setFieldsMissing(false);  
  }

  const handleLogin = () => {
    // normal login function 
    clearErrors();   
    // check all fields have a value 
    if (email === "" || password === "") {
      setFieldsMissing(true);
    } else { 
      setFieldsMissing(false);
    }     
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(result => {
        console.log("signed in with email and password")      
      })
      .catch(err => {
        switch(err.code){
          case "auth/invalid-email":
          case "auth/user-disabled":
          case "auth/user-not-found":
            setEmailError(err.message);
            break;
          case "auth/wrong-password":
            setPasswordError(err.message);
            break;
        }
      })
  }  

  return (
    <IonPage>
      <IonToolbar>
        <IonTitle>Sign In</IonTitle>
      </IonToolbar>
      <IonContent id="signin-content">   
        <div className="signin-inputs">
          <IonInput 
          class="create-input"
          value={email} 
          placeholder="Email"
          type="email"
          onIonChange={e => setEmail(e.detail.value!)}
          >        
          </IonInput>
          <IonText class="errormsg">{emailError}</IonText><br/>        
          <IonRow class="ion-align-items-center">
            <IonInput 
            class="create-input" 
            value={password} 
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            onIonChange={e => setPassword(e.detail.value!)}
            >
            </IonInput>   
            <IonButton onClick={()=>setShowPassword(!showPassword)}>
              <IonIcon slot="icon-only" icon={eyeOutline} />
            </IonButton>                  
          </IonRow>
          <IonText class="errormsg">{passwordError}</IonText><br/>
          <IonText class="errormsg">{fieldsMissing ? "Please fill in all the fields" : (null)} </IonText>
          <IonButton class="signin-button" onClick={() => handleLogin()}>Sign in</IonButton>
          <p className="errormsg">Don't have an account? <br/><IonButton className="yellow-text" href="/signup">Sign up</IonButton></p>
          <p className="errormsg"><IonButton className="yellow-text">Forgot Password?</IonButton></p>  
        </div>          
      </IonContent>
    </IonPage>
  )
}

export default SignIn;