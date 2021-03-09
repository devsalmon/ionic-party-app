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
  IonCol,
  IonLoading
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

// declare global {
//   interface Window {
//       snapKitInit:any;
//   }
// }

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
  const [signIn, setSignIn] = useState(false);  
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [resetPasswordLink, setResetPasswordLink] = useState(false);
  const [loading, setLoading] = useState(false);

  // When this component renders
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.snapkit.com/js/v1/login.js";
    script.async = true;
    script.onload = () => scriptLoaded();
  
    document.body.appendChild(script);
    var url_string = window.location.href;
    var url = new URL(url_string);
    // Get the action to complete.    
    var mode = url.searchParams.get("mode");
    if (mode === "resetPassword" && mode !== null) {
      // redirect to reset password page if the link is a reset password link
      setResetPasswordLink(true);    
    } else {
      setResetPasswordLink(false);
    }

    // check if user is verified
    if (firebase.auth().currentUser) { // if user is already signed in
        var ver = firebase.auth().currentUser.emailVerified;
        setVerified(ver);
    } else {   
      // Get the saved email
      const saved_email = window.localStorage.getItem("emailForSignIn");
      // Verify the user went through an email link and the saved email is not null
      if (firebase.auth().isSignInWithEmailLink(window.location.href) && saved_email) {
        // Sign the user in
        firebase.auth().signInWithEmailLink(saved_email, window.location.href)
          .then((result) => {
            // You can check if the user is new or existing:  
            setVerified(true);
          })
          .catch(error => {
            console.log(error.message)
            setEmailError("Email already authenticated, go to sign in. If it doesn't work, try signing up again.")
          });
      } 
    }
  }, [signIn]);  

  var actionCodeSettings = {
    url: 'http://localhost:8100/signup',
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
    setLoading(true);
    // If the user is re-entering their email address but already has a code
    if (firebase.auth().isSignInWithEmailLink(window.location.href) && !!email) {
        // Sign the user up to firebase
        firebase.auth().signInWithEmailLink(email, window.location.href)
        .then(() => {
          setLoading(false);
          setVerified(true); // user is verified as they came from the sign up link            
        }).catch((err) => {
          switch (err.code) {
          default:
              setEmailError("An error has occured, try again");
          }
          setLoading(false);
        });      
    } else {
        setVerified(false);          
        firebase.auth()
          .sendSignInLinkToEmail(email, actionCodeSettings)
          .then(() => {
            setLoading(false);
            // Save the users email to verify it after they access their email
            window.localStorage.setItem("emailForSignIn", email);
            setLinkSent(true);
          })
          .catch(err => {
            setLoading(false);
            switch(err.code){
              case "auth/email-already-in-use":
              case "auth/invalid-email":
              setEmailError(err.message);
              break;
            }
          });
    }
  };  


  const scriptLoaded = () => {
    alert("done")
  }
  //const window = any;
//  window.snapKitInit = function () {
  window.snapKitInit = () => {
    //  const snapKitInit = () => {
        var loginButtonIconId = 'my-login-button-target';
        // Mount Login Button
        snap.loginkit.mountButton(loginButtonIconId, {
          clientId: 'da4cfce9-4a5c-4892-af98-7db4ff1720d6',
          redirectURI: 'http://localhost:1800/signup',
          scopeList: [
            'user.display_name',
            'user.bitmoji.avatar',
            'user.external_id'
          ], handleResponseCallback: function() {
          snap.loginkit.fetchUserInfo().then(
            function (result) {
              console.log("User info:", result.data.me);
              document.getElementById("display_name").innerHTML =
                result.data.me.displayName;
              document.getElementById("bitmoji").src =
                result.data.me.bitmoji.avatar;
              document.getElementById("external_id").src =
                result.data.me.externalId;
            },
            function (err) {
              console.log(err); // Error
            }
          );
        },
      });
    };
    
    (function (d, s, id) {
      var js,
      sjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = "https://sdk.snapkit.com/js/v1/login.js";
      alert("TEST")
      sjs.parentNode.insertBefore(js, sjs);
    })(document, "script", "loginkit-sdk"); 


  const completeUserInfo = async () => {
    setLoading(true);
    if (email.trim() !== "" && fullname.trim() !== "" && username.trim() !== "" && password.trim() !== "") {
        setFieldsMissing(false);
        setPasswordError("");
        var userid = firebase.auth().currentUser.uid
        firebase.firestore().collection("users").where("username", "==", username).get().then(snap => {
          if (snap.empty) { // if no duplicate username
            // set user's password
            setUsernameError("");
            firebase.auth().currentUser.updatePassword(password).then(() => {
                // add user info to their document
                return firebase.firestore().collection('users').doc(userid).set({ // create a user document when a new user signs up
                    fullname: fullname,
                    username: username,
                    email: email,      
                    id: userid,
                }).then(() => {                  
                  // sign out and back in again to trigger app refresh
                  firebase.auth().signOut().then(() => {
                    firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
                      setLoading(false);
                    }).catch((error) => {
                        setLoading(false);
                        setPasswordError(error.message)
                      }
                    );                    
                  }).catch((error) => {
                    setLoading(false);
                    setPasswordError(error.message)
                  })
                }).catch((error) => setPasswordError(error.message))
            }).catch((error) => { 
              setLoading(false);
              setPasswordError(error.message)
            });               
          } else {
            setLoading(false);
            setUsernameError("This username is already in use, try another one")        
          }
        })                          
    } else {
      setLoading(false);
      setPasswordError('')
      setFieldsMissing(true);        
    }
  }

    function resetPassword() {
      setLoading(true);
      setPasswordError("");
      var url_string = window.location.href;
      var url = new URL(url_string);
      // Get the action to complete.    
      var mode = url.searchParams.get("mode");
      // Get the one-time code from the query parameter.
      var actionCode = url.searchParams.get('oobCode');
      // (Optional) Get the continue URL from the query parameter if available.
      var continueUrl = url.searchParams.get('continueUrl');
      // (Optional) Get the language code if available.
      var lang = url.searchParams.get('lang') || 'en';

      if (mode = "resetPassword") {
          // Verify the password reset code is valid.
          firebase.auth().verifyPasswordResetCode(actionCode).then((useremail) => {                
              var accountEmail = useremail;
              var newPassword = password;
              // Save the new password.
              firebase.auth().confirmPasswordReset(actionCode, newPassword).then((resp) => {
                  // Password reset has been confirmed and new password updated.
                  setLoading(false);
                  setPasswordUpdated(true);
              }).catch((error) => {
                setLoading(false);
                setPasswordError(error.message)
              });
          }).catch((error) => {
            setLoading(false);
            setPasswordError("Invalid or expired code, please try reseting your password again")
          });
      }
    }  

  const handleLogin = () => {
    // normal login function 
    setLoading(true);
    clearErrors();   
    setPasswordUpdated(false); // remove popover
    // check all fields have a value 
    if (email === "" || password === "") {
      setFieldsMissing(true);
      setLoading(false);
    } else { 
      setFieldsMissing(false);
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then(result => {
          setLoading(false);
          console.log("signed in with email and password")      
        })
        .catch(err => {
          setLoading(false);
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
  }    

  if (resetPasswordLink) {
    return(
    <IonPage>
      <IonToolbar class="ion-padding">
        <IonTitle class="ion-padding">Reset Password</IonTitle>
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
            placeholder="New Password"
            onIonChange={e => setPassword(e.detail.value!)}
            >
            </IonInput>   
            <IonButton onClick={()=>setShowPassword(!showPassword)}>
              <IonIcon slot="icon-only" icon={eyeOutline} />
            </IonButton>                  
          </IonRow>
          <IonText class="errormsg">{passwordError}</IonText><br/>
          <IonText class="errormsg">{fieldsMissing ? "Please fill in all the fields" : (null)} </IonText>
          <IonButton class="signin-button" onClick={() => resetPassword()}>Reset Password</IonButton>
          <IonPopover
            cssClass="popover"        
            isOpen={passwordUpdated}
            onDidDismiss={() => handleLogin()}
          > 
          <IonText className="ion-padding">Your password has been updated!</IonText><br/>
          <IonButton onClick={() => handleLogin()}>Ok</IonButton>
          </IonPopover>  
          <IonPopover
            cssClass="popover"        
            isOpen={signIn}
            onDidDismiss={() => setSignIn(false)}
          > 
          <IonText className="ion-padding">Thanks for signing up! Click to continue</IonText><br/>
          <IonButton href="/home">Ok</IonButton>
          </IonPopover>                   
        </div>          
      </IonContent>
      <IonLoading 
      cssClass="loading"
      spinner="bubbles"
      isOpen={loading} 
      onDidDismiss={() => setLoading(false)} />       
    </IonPage>
    )
  } else {
    return (
      <IonPage>
        <IonToolbar class="ion-padding">
          <IonTitle class="ion-padding">Sign Up</IonTitle>
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
          <div id="my-login-button-target"></div>
          <div id="display_name"></div>
          <img id="bitmoji"/>
          <div id="external_id"></div>
        </IonContent>
        <IonLoading 
        cssClass="loading"
        spinner="bubbles"
        isOpen={loading} 
        onDidDismiss={() => setLoading(false)} />         
      </IonPage>
    )
  }
}

export default SignUp;