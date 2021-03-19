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
    window.localStorage.getItem("email") || ""
  );
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [fieldsMissing, setFieldsMissing] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);

  const script = document.createElement("script");
  script.src = "https://sdk.snapkit.com/js/v1/login.js"; //Try change this url
  script.async = true;
  //script.onload = () => scriptLoaded();
  document.body.appendChild(script);

  var actionCodeSettings = {
    url: 'http://localhost:8100/signup',
    iOS: {
      bundleId: 'com.partyuptest.partyapp'
    },
    android: {
      packageName: 'com.charke.partyapp',
      installApp: true,
      minimumVersion: '12'
   },
    handleCodeInApp: false,
    // When multiple custom dynamic link domains are defined, specify which
    // one to use.
   //dynamicLinkDomain: "test1619.page.link"
  };  

  const clearInputs = () => {
    setEmail('');
    setPassword('');
  }

  const clearErrors = () => {
    setEmailError('');
    setPasswordError('');  
    setFieldsMissing(false);  
  }

  const resetPassword = () => {
    setForgotPassword(false); // remove popover
    if (!email) { // ask user to provide an email address
      setEmailError("Please provide an email before resetting your password")
    } else {
      setEmailError("")
      firebase.auth().sendPasswordResetEmail(email, actionCodeSettings).then(() => {
        setEmailSent(true);
      }).catch(function(error) {
        setPasswordError(error.message);
      });          
    }
  }

  const handleLogin = () => {
    // normal login function 
    clearErrors();   
    // check all fields have a value 
    if (email === "" || password === "") {
      setFieldsMissing(true);
    } else if (firebase.auth().currentUser && firebase.auth().currentUser.email !== email) {
      firebase.auth().signOut().then(function() {
        signIn();        
      });    
    } else if (firebase.auth().currentUser && !firebase.auth().currentUser.emailVerified) {
      setPasswordError("Not verified, please click the link in your email to verify your account");      
    } else { 
      signIn();
    }
  }  

  const signIn = () => {
    setFieldsMissing(false);     
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
    {/* <div id="my-login-button-target"></div>
    <div id="display_name"></div>
    <img id="bitmoji"/>
    <div id="external_id"></div> */}

      <IonToolbar class="ion-padding">
        <IonTitle class="ion-padding">Sign In</IonTitle>
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
          <p className="errormsg"><IonButton className="yellow-text" onClick={() => setForgotPassword(true)}>Forgot Password?</IonButton></p>  
          {emailSent ? <IonText class="errormsg">Email sent, click the link to reset your password</IonText> : null}
          <IonPopover
            cssClass="popover"        
            isOpen={forgotPassword}
            onDidDismiss={() => setForgotPassword(false)}
          > 
          <IonText className="ion-padding">Reset password?</IonText><br/>
          <IonButton onClick={() => setForgotPassword(false)}>No</IonButton>
          <IonButton onClick={() => resetPassword()}>Yes</IonButton>
          </IonPopover>         
        </div>          
      </IonContent>
    </IonPage>
  )
}

export default SignIn;