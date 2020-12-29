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

const SignIn = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [googleError, setGoogleError] = useState('');
  const [hasAccount, setHasAccount] = useState(false);

  const clearInputs = () => {
    setEmail('');
    setPassword('');
  }

  const clearErrors = () => {
    setEmailError('');
    setPasswordError('');    
  }

  const handleLogin = () => {
    // normal login function 
    clearErrors();    
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function(user){
      console.log("login")
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
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function(data) {
      console.log("signup")
      firebase.firestore().collection('users').doc(data.user.uid).set({
        name: data.user.displayName,
        photoUrl: data.user.photoURL
      })
    })
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
        <IonInput 
        class="create-input"
        value={email} 
        placeholder="Email"
        type="email"
        onIonChange={e => setEmail(e.detail.value!)}
        ></IonInput>
        <IonText class="errormsg">{emailError}</IonText>
        <IonInput 
        class="create-input" 
        value={password} 
        placeholder="Password"
        type="password"
        onIonChange={e => setPassword(e.detail.value!)}
        ></IonInput>
        <IonText class="errormsg">{passwordError}</IonText>
          {hasAccount ? (
            <>
              <IonButton class="create-button" onClick={() => handleLogin()}>Sign in</IonButton>
              <p className="errormsg">Don't have an account? <span onClick={() => setHasAccount(!hasAccount)}>Sign up</span></p>
            </>
          ) : (
            <>
              <IonButton class="create-button" onClick={() => handleSignUp()}>Sign up</IonButton>
              <p className="errormsg">Have an account? <span onClick={() => setHasAccount(!hasAccount)}>Sign in</span></p>
            </>
          )}       
        <IonButton class="create-button" onClick={() => SignInGooglepu()}>Sign in with google</IonButton>  
        <IonText class="errormsg">{googleError}</IonText>
      </IonContent>
    </IonPage>
  )
}

export default SignIn;