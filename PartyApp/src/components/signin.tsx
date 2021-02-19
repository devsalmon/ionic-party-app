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

  const [email, setEmail] = useState('');
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
  const [hasAccount, setHasAccount] = useState(true);
  const [linkSent, setLinkSent] = useState(false);

  useEffect(() => {
    clearInputs(); // clear all inputs when a user has signed in            
  }, [hasAccount])

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
 // const verify = () => {
 //   firebase.auth().currentUser.sendEmailVerification(actionCodeSettings)
//  } 

  const userVerification = () => {
    var user = firebase.auth().currentUser;
    user.sendEmailVerification().then(function() {
      setLinkSent(true);
    }).catch(function(error) {
      console.log(error.message)
      console.log(error.code)
    });   
  }

  const createNewUser = async() => {    
    //firebase.auth().createUserWithEmailAndPassword(email, password) 
    //  .then(result => {
      console.log("CreateNewUser triggered")
      console.log(email)
    firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings)
  .then(() => {
    // The link was successfully sent. Inform the user.
    // Save the email locally so you don't need to ask the user for it again
    // if they open the link on the same device.
    //window.localStorage.setItem('emailForSignIn', email);
      //mobileNumber: mobileNumber ? mobileNumber : null     
      console.log("Email sent")  
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

// Confirm the link is a sign-in with email link.
if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
  // Additional state parameters can also be passed via URL.
  // This can be used to continue the user's intended action before triggering
  // the sign-in operation.
  // Get the email if available. This should be available if the user completes
  // the flow on the same device where they started it.
  //var email = window.localStorage.getItem('emailForSignIn');
  console.log("yes1")
  if (!email) {
    console.log("Yes1.5")
    // User opened the link on a different device. To prevent session fixation
    // attacks, ask the user to provide the associated email again. For example:
   // email = window.prompt('Please provide your email for confirmation');
  }
  // The client SDK will parse the code from the link for you.
  firebase.auth().signInWithEmailLink(email, window.location.href)
    .then((result) => {
      // Clear email from storage.
      //window.localStorage.removeItem('emailForSignIn');
      // You can access the new user via result.user
      // Additional user info profile not available via:
      // result.additionalUserInfo.profile == null
      // You can check if the user is new or existing:
      // result.additionalUserInfo.isNewUser
      console.log("YES2")
      firebase.firestore().collection('users').doc(result.user.uid).set({ // create a user document when a new user signs up
        fullname: fullname,
        username: username,
        email: email,      
        id: result.user.uid,
        //mobileNumber: mobileNumber ? mobileNumber : null       
        })         
    })
    .catch((error) => {
      // Some error occurred, you can inspect the code: error.code
      // Common errors could be invalid email and invalid or expired OTPs.
    });
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
  // const SignInGooglepu = async() => {
  //   // Initiate Firebase Auth.
  //   // Sign into Firebase using popup auth & Google as the identity provider.
  //   setGoogleError(''); // clear errors
  //   var provider = new firebase.auth.GoogleAuthProvider();
  //   //Sign in with pop up
  //   firebase.auth().signInWithPopup(provider).then(function (result) {
  //     // This gives you a Google Access Token. You can use it to access the Google API.
  //     //var token = result.credential.accessToken;
  //     // The signed-in user info.
  //     var user = result.user;
  //     const isNewUser = result.additionalUserInfo.isNewUser
  //     if (isNewUser) {
  //       firebase.firestore().collection('users').doc(user.uid).set({
  //         name: user.displayName,
  //         photoUrl: user.photoURL
  //       })       
  //     }
  //   }).catch(function (error) {
  //     // Handle Errors here.
  //     setGoogleError(error.message);
  //   });
  //   // Get the signed-in user's profile pic and name.
  //   //var profilePicUrl = getProfilePicUrl();
  //   //var userName = getUserName();
  //   // Set the user's profile pic and name.
  //   //document.getElementById('user-pic').style.backgroundImage = 'url(' + addSizeToGoogleProfilePic(profilePicUrl) + ')';
  //   //document.getElementById('user-name').textContent = userName;
  // }

  return (
    <IonPage>
      <IonToolbar>
        {hasAccount ? <IonTitle>Sign In</IonTitle> : <IonTitle>Sign Up</IonTitle>}
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
        {hasAccount ? 
          null : (
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
            </>
          )
        }
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
          {hasAccount ? (
            <>
              <IonButton class="signin-button" onClick={() => handleLogin()}>Sign in</IonButton>
              <p className="errormsg">Don't have an account? <br/><span className="yellow-text" onClick={() => setHasAccount(!hasAccount)}>Sign up</span></p>
              <p className="errormsg"><span className="yellow-text">Forgot Password?</span></p>
            </>
          ) : (
            <>
              <IonButton class="signin-button" onClick={() => handleSignUp()}>Sign up</IonButton>
              <p className="errormsg">Have an account? <span className="yellow-text" onClick={() => setHasAccount(!hasAccount)}>Sign in</span></p>
            </>
          )}
          {linkSent ? (
            <IonText class="errormsg">A verification link has been sent to your email, please click it to finish signing up</IonText>
          ) : (null)}     
        </div>          
      </IonContent>
    </IonPage>
  )
}

export default SignIn;