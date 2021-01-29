import React, { useState, useEffect} from 'react';
import firebase from '../firestore';
import {
  IonItem,
  IonButton,
  IonPage,
  IonContent, 
  IonToolbar, 
  IonButtons, 
  IonTitle,
  IonInput, 
  IonText,
} from '@ionic/react';
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

  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [fullnameError, setFullnameError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [googleError, setGoogleError] = useState('');
  const [fieldsMissing, setFieldsMissing] = useState(false);
  const [hasAccount, setHasAccount] = useState(false);
  const [linkSent, setLinkSent] = useState(false);

  useEffect(() => {
    clearInputs(); // clear all inputs when a user has signed in            
  }, [hasAccount])

  var actionCodeSettings = {
    url: 'https://partyuptest.page.link/partyuptestlink',
    iOS: {
      bundleId: 'com.partyuptest.ios'
    },
    android: {
      packageName: 'com.partyuptest.android',
      installApp: true,
      minimumVersion: '12'
    },
    handleCodeInApp: true,
    // When multiple custom dynamic link domains are defined, specify which
    // one to use.
    dynamicLinkDomain: "partyuptest.page.link"
  };  

  const userVerification = () => {
    var user = firebase.auth().currentUser;
    user.sendEmailVerification().then(function() {
      setLinkSent(true);
    }).catch(function(error) {
      console.log(error.message)
      console.log(error.code)
    });   
  }

  const createNewUser = () => {
    console.log("create user triggered")
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(result => {
      firebase.firestore().collection('users').doc(result.user.uid).set({
        fullname: fullname,
        username: username,
        email: email,      
        id: result.user.uid       
        //mobileNumber: mobileNumber ? mobileNumber : null              
      })    
    })
      //userVerification();
      .catch(err => {
        switch(err.code){
          case "auth/email-already-in-use":
          case "auth/invalid-email":
            setEmailError(err.message);
            break;
          case "auth/weak-password":
            setPasswordError(err.message);
            break;
        }
      })  
  }

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
        clearInputs(); // clear all inputs when a user has signed in       
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

  const handleSignUp = () => {
    // sign up function for new users
    clearErrors();
    // check all fields have a value
    if (email === "" || fullname === "" || username === "" || password === "") {
      setFieldsMissing(true);
    } else { 
      setFieldsMissing(false);   
      createNewUser();   
    }    
    }

    // Signs-in Messaging with GOOGLE POP UP
  const SignInGooglepu = async() => {
    // Initiate Firebase Auth.
    // Sign into Firebase using popup auth & Google as the identity provider.
    setGoogleError(''); // clear errors
    var provider = new firebase.auth.GoogleAuthProvider();
    //Sign in with pop up
    firebase.auth().signInWithPopup(provider).then(function (result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      //var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      const isNewUser = result.additionalUserInfo.isNewUser
      if (isNewUser) {
        firebase.firestore().collection('users').doc(user.uid).set({
          name: user.displayName,
          photoUrl: user.photoURL
        })       
      }
    }).catch(function (error) {
      // Handle Errors here.
      setGoogleError(error.message);
    });
    // Get the signed-in user's profile pic and name.
    //var profilePicUrl = getProfilePicUrl();
    //var userName = getUserName();
    // Set the user's profile pic and name.
    //document.getElementById('user-pic').style.backgroundImage = 'url(' + addSizeToGoogleProfilePic(profilePicUrl) + ')';
    //document.getElementById('user-name').textContent = userName;
  }

  return (
    <IonPage>
      <IonToolbar>
        <IonTitle size="large">Sign in</IonTitle>
      </IonToolbar>
      <IonContent>   
        <IonText>(logo here)</IonText><br/><br/>      
        <IonInput 
        class="create-input"
        value={email} 
        placeholder="Email"
        type="email"
        onIonChange={e => setEmail(e.detail.value!)}
        ></IonInput>
        <IonText class="errormsg">{emailError}</IonText>
        {hasAccount ? 
          null : (
            <>
              <IonInput 
              class="create-input" 
              value={fullname} 
              placeholder="Full name"
              type="text"
              onIonChange={e => setFullname(e.detail.value!)}
              ></IonInput>  
              <IonText class="errormsg">{fullnameError}</IonText>
              <IonInput 
              class="create-input" 
              value={username} 
              placeholder="Username"
              type="text"
              onIonChange={e => setUsername(e.detail.value!)}
              ></IonInput> 
              <IonText class="errormsg">{usernameError}</IonText>
            </>
          )
        }       
        <IonInput 
        class="create-input" 
        value={password} 
        placeholder="Password"
        type="password"
        onIonChange={e => setPassword(e.detail.value!)}
        ></IonInput>
        <IonText class="errormsg">{passwordError}</IonText>
        <IonText class="errormsg">{fieldsMissing ? "Please fill in all the fields" : (null)} </IonText>
          {hasAccount ? (
            <>
              <IonButton class="create-button" onClick={() => handleLogin()}>Sign in</IonButton>
              <p className="errormsg">Don't have an account? <span onClick={() => setHasAccount(!hasAccount)}>Sign up</span></p>
              <p className="errormsg"><span>Forgot Password?</span></p>
            </>
          ) : (
            <>
              <IonButton class="create-button" onClick={() => handleSignUp()}>Sign up</IonButton>
              <p className="errormsg">Have an account? <span onClick={() => setHasAccount(!hasAccount)}>Sign in</span></p>
            </>
          )}
          {linkSent ? (
            <IonText class="errormsg">A verification link has been sent to your email, please click it to finish signing up</IonText>
          ) : (null)}       
        <IonButton class="create-button" onClick={() => SignInGooglepu()}>Sign in with google</IonButton>  
        <IonText class="errormsg">{googleError}</IonText>
      </IonContent>
    </IonPage>
  )
}

export default SignIn;