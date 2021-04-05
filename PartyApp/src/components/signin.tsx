import React, { useState, useEffect} from 'react';
import firebase from '../firestore';
// import PhoneInput from 'react-phone-number-input';
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
  const [emailorphone, setEmailorphone] = useState(
    window.localStorage.getItem("emailorphone") || ""
  );
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailorphoneError, setEmailorphoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [fieldsMissing, setFieldsMissing] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);

  useEffect(() => {
    clearErrors();
    if (firebase.auth().currentUser && !firebase.auth().currentUser.emailVerified) { 
      var email = firebase.auth().currentUser.email
      // if user has signed in by pressing a button in sign up, but isn't verified    
      setPasswordError(email + " is not verified yet, please click the link in your email to verify your account");           
    }
  }, [])

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

  const clearErrors = () => {
    setEmailorphoneError('');
    setPasswordError('');  
    setFieldsMissing(false);  
  }

  const resetPassword = () => {  
    clearErrors();  
    if (emailorphone.trim() === "") { // ask user to provide an email address
      setEmailorphoneError("Please provide an email or phone number before resetting your password");
      setForgotPassword(false); // remove popover
    } else {
      setEmailorphoneError("")
      firebase.auth().sendPasswordResetEmail(emailorphone, actionCodeSettings).then(() => {
        setEmailSent(true);
        setForgotPassword(false); // remove popover
      }).catch(function(error) {
        setPasswordError(error.message);           
        setForgotPassword(false); // remove popover                                   
      });          
    }
  }

  const handleLogin = () => {
    // normal login function 
    clearErrors();   
    // check all fields have a value 
    if (emailorphone === "" || password === "") {
      setFieldsMissing(true);
    } else if (firebase.auth().currentUser && !firebase.auth().currentUser.emailVerified) {
      setPasswordError("Not verified, please click the link in your email to verify your account");      
    } else { 
      var re = new RegExp(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g)
      if (re.test(emailorphone)) { // it's a phone number
        console.log("phone number")
        phoneSignIn()
      } else {
        console.log("email")
        emailSignIn()
      }
    }
  }  

  const emailSignIn = () => {
    setFieldsMissing(false);     
    firebase.auth().signInWithEmailAndPassword(emailorphone, password)
      .then(result => {
        console.log("signed in with email and password")      
      })
      .catch(err => {
        switch(err.code){
          case "auth/invalid-email":
          case "auth/user-disabled":
          case "auth/user-not-found":
            setEmailorphoneError(err.message);
            break;
          case "auth/wrong-password":
            setPasswordError(err.message);
            break;
        }
        console.log(err.message)
      })    
  }

  const phoneSignIn = () => {
    setFieldsMissing(false);     
    var phoneEmail = emailorphone + '@partyemail.com';
    firebase.auth().signInWithEmailAndPassword(phoneEmail, password)
      .then(result => {
        console.log("signed in with email and password")      
      })
      .catch(err => {
        switch(err.code){
          case "auth/invalid-email":
            setEmailorphoneError("Phone number not found or not formatted correctly")
          case "auth/user-disabled":
          case "auth/user-not-found":
            setEmailorphoneError(err.message);
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
          {/* <PhoneInput
            defaultCountry="GB"
            placeholder="Enter phone number"
            value={emailorphone}
            onChange={setEmailorphone}/>         */}
          <IonInput 
          class="create-input"
          value={emailorphone} 
          placeholder="Mobile Number or Email"
          type="text"
          onIonChange={e => setEmailorphone(e.detail.value!)}
          >        
          </IonInput>            
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
          <IonText class="errormsg">{emailorphoneError}</IonText><br/>      
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