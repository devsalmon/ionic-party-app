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

const SignUp: React.FC = () => {

  // Will try to use previously entered email, defaults to an empty string
  const [email, setEmail] = useState(
    window.localStorage.getItem("emailForSignIn") || ""
  );
  const [mobileNumber, setMobileNumber] = useState('');
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [fullnameError, setFullnameError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [googleError, setGoogleError] = useState('');
  const [fieldsMissing, setFieldsMissing] = useState(false);
  const [linkSent, setLinkSent] = useState(false); 
  const [verified, setVerified] = useState(false);  
  const [refresh, setRefresh] = useState(false);  

  // When this component renders
  useEffect(() => {
    // check if user is verified
    if (firebase.auth().currentUser) {
        var ver = firebase.auth().currentUser.emailVerified;
        setVerified(ver);
    }
    // Get the saved email
    const saved_email = window.localStorage.getItem("emailForSignIn");
    // Verify the user went through an email link and the saved email is not null
    if (firebase.auth().isSignInWithEmailLink(window.location.href) && !!saved_email) {
      // Sign the user in
      firebase.auth().signInWithEmailLink(saved_email, window.location.href)
        .then((result) => {
          // You can check if the user is new or existing:          
          setVerified(true);
        })
        .catch(error => {
          console.log(error.message)
        });
    }
  }, [refresh]);  

  var actionCodeSettings = {
    url: 'https://www.example.com/finishSignUp?cartId=1234',
    iOS: {
      bundleId: 'com.partyuptest.ios'
    },
    android: {
      packageName: 'com.charke.partyapp',
      installApp: true,
      minimumVersion: '1'
   },
    handleCodeInApp: true,
   // When multiple custom dynamic link domains are defined, specify which
    // one to use.
   dynamicLinkDomain: "test1619.page.link"
  };  

  const clearInputs = () => {
    setEmail('');
    setMobileNumber('');
    setFullname('');
    setUsername('');
    setPassword('');
    setLinkSent(false);
  }

  const clearErrors = () => {
    setEmailError('');
    setFullnameError('');
    setUsernameError('');
    setPasswordError('');  
    setFieldsMissing(false);  
  }

  const handleSignUp = async () => {
    // sign up function for new users
    clearErrors();  
    // If the user is re-entering their email address but already has a code
    if (firebase.auth().isSignInWithEmailLink(window.location.href) && !!email) {
        // Sign the user up to firebase
        firebase.auth().signInWithEmailLink(email, window.location.href)
        .then(() => {
            setVerified(true); // user is verified as they came from the sign up link
        }).catch((err) => {
            switch (err.code) {
            default:
                setEmailError("An error has occured, try again");
            }
        });      
    } else {
        setVerified(false);          
        firebase.auth()
            .sendSignInLinkToEmail(email, actionCodeSettings)
            .then(() => {
                // Save the users email to verify it after they access their email
                window.localStorage.setItem("emailForSignIn", email);
                setLinkSent(true);
            })
            .catch(err => {
            switch(err.code){
                case "auth/email-already-in-use":
                case "auth/invalid-email":
                setEmailError(err.message);
                break;
            }
            });
    }
  };  

  const completeUserInfo = async () => {
    if (email.trim() !== "" && fullname.trim() !== "" && username.trim() !== "" && password.trim() !== "") {
        setFieldsMissing(false);
        var userid = firebase.auth().currentUser.uid
        // set user's password
        await firebase.auth().currentUser.updatePassword(password).then(() => {
            // add user info to their document
            firebase.firestore().collection('users').doc(userid).set({ // create a user document when a new user signs up
                fullname: fullname,
                username: username,
                email: email,      
                id: userid,
            })
            setRefresh(!refresh) 
        }).catch((error) => { 
            setPasswordError(error.message)
        });                
    } else {
        setPasswordError('')
        setFieldsMissing(true);        
    }
  }

  return (
    <IonPage>
      <IonToolbar>
        <IonTitle>Sign Up</IonTitle>
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
        {verified ? 
        <>
        <IonInput 
        class="create-input" 
        value={fullname} 
        placeholder="Full name"
        type="text"
        onIonChange={e => setFullname(e.detail.value!)}
        >                  
        </IonInput>  
        <IonText class="errormsg">{fullnameError}</IonText><br/>
        <IonInput 
        class="create-input" 
        value={username} 
        placeholder="Username"
        type="text"
        onIonChange={e => setUsername(e.detail.value!)}
        >                
        </IonInput> 
        <IonText class="errormsg">{usernameError}</IonText><br/>
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
        </>
        : null}
        {verified ? <IonButton class="signin-button" onClick={() => completeUserInfo()}>Continue</IonButton> : <IonButton class="signin-button" onClick={() => handleSignUp()}>Sign up</IonButton>}
        <p className="errormsg">Have an account? <IonButton className="yellow-text" href="/signin" >Sign in</IonButton></p>
        {linkSent ? (
        <IonText class="errormsg">A link has been sent to your email, please click it to verify your email</IonText>
        ) : (null)}     
        </div>          
      </IonContent>
    </IonPage>
  )
}

export default SignUp;