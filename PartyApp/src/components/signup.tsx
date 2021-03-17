import React, { useState, useEffect } from 'react';
import Script from 'react-load-script'
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
  IonLoading,
} from '@ionic/react';
import { 
  eyeOutline,
  chevronDownCircleOutline
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
import moment from 'moment';

declare global {
  interface Window {
    recaptchaVerifier:any;
    recaptchaWidgetId:any;
    confirmationResult:any;
  }
}

const SignUp: React.FC = () => {

  // Will try to use previously entered email, defaults to an empty string
  const [email, setEmail] = useState(
    window.localStorage.getItem("email") || ""
  );
  const [phoneNumber, setPhoneNumber] = useState(
    window.localStorage.getItem("phoneNumber") || ""
  );
  const [dob, setDob] = useState(
    window.localStorage.getItem("dob") || ""
  );
  const [fullname, setFullname] = useState(
    window.localStorage.getItem("fullname") || ""
  );
  const [username, setUsername] = useState(
    window.localStorage.getItem("username") || ""
  );
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [fullnameError, setFullnameError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [dobError, setDobError] = useState('');
  const [fieldsMissing, setFieldsMissing] = useState(false);
  const [linkSent, setLinkSent] = useState(false); 
  const [signIn, setSignIn] = useState(false);  
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');

  // When this component renders
  useEffect(() => {  
    clearErrors();   
    if (firebase.auth().currentUser && firebase.auth().currentUser.emailVerified === false) {
      setLinkSent(true);
    }
    const script = document.createElement("script");
    script.src = "https://sdk.snapkit.com/js/v1/login.js"; //Try change this url
    script.async = true;
    //script.onload = () => scriptLoaded();
    document.body.appendChild(script);
 
      //window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    //console.log("recaptcha...")
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
      'size': 'invisible',
      'callback': (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        // ...
        console.log(response)
        //phoneNumberAuth()
      },
      'expired-callback': () => {
        // Response expired. Ask user to solve reCAPTCHA again.
        // ...
        console.log("expired")
      }
    });
    window.recaptchaVerifier.render().then(function (widgetId) {
      window.recaptchaWidgetId = widgetId;   
    }); 
  }, [signIn]);  

  var actionCodeSettings = {
    url: "http://localhost:8100/signup",
    dynamicLinkDomain: "test1619.page.link",
    handleCodeInApp: false,
    iOS: {
      bundleId: 'com.charke.partyapp',
    },
    android: {
      packageName: 'com.charke.partyapp',
      minimumVersion: '12',
      installApp: true,
    }
  };  

  const clearInputs = () => {
    setEmail('');
    setPhoneNumber('');
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
    clearErrors();
    // check which sign up method to use
    if (email.trim() !== "" && phoneNumber.trim() !== "") {
      setPasswordError("Enter either phone number or email, not both")
    } else if (email.trim() !== "") { // they want email sign up
      emailSignUp();
    } else if (phoneNumber.trim() !== "") { // they want phone sign up
      phoneSignUp();
    } else {   // they didn't enter either
      setPasswordError("Enter email or phone number")
    }
  }; 

  const emailSignUp = async() => {
    // sign up function for new users
    clearErrors();  
    setLoading(true);
    setLinkSent(false);      
    if (email.trim() !== "" && fullname.trim() !== "" && username.trim() !== "" && password.trim() !== "") {
      setFieldsMissing(false);
      setPasswordError("");      
      window.localStorage.setItem("email", email);
      window.localStorage.setItem("phoneNumber", phoneNumber);
      window.localStorage.setItem("fullname", fullname);
      window.localStorage.setItem("username", username);
      window.localStorage.setItem("dob", dob);
      if (moment(dob.trim(), 'DD/MM/YYYY', true).isValid() && moment(dob.trim()).isBefore(new Date())) { // check dob format is valid
        firebase.auth().createUserWithEmailAndPassword(email, password).then(user => {
          firebase.auth().signInWithEmailAndPassword(email, password).then(res => {
            firebase.firestore().collection("users").where("username", "==", username).get().then(snap => {
              if (snap.empty) { // if no duplicate username
                setLoading(false);
                completeUserInfo(); // create user document
                sendVerificationEmail();           
              } else {
                setLoading(false);
                setUsernameError("This username is already in use, try another one")        
              }
            }).catch(err => {
              console.log(err.message);
              setLoading(false);
            })             
          }).catch(err => {
            setPasswordError(err.message);
            setLoading(false);
          })   
        }).catch(err => {
          setLoading(false);
          switch(err.code){
            case "auth/invalid-email":
            case "auth/email-already-exists":
            case "auth/email-already-in-use":
              setEmailError(err.message);
              break;
            case "auth/invalid-password":
              setPasswordError(err.message);
              break;
          }              
        });        
      } else {
        setLoading(false);
        setDobError("Wrong format for date of birth")
      }                       
    } else {
      setLoading(false);
      setPasswordError('')
      setFieldsMissing(true);        
    }
  } 

  const completeUserInfo = () => {
    clearErrors();
    const userid = firebase.auth().currentUser.uid
    firebase.firestore().collection('users').doc(userid).set({ // create a user document when a new user signs up
      fullname: fullname,
      username: username,
      email: email,      
      id: userid,
      phoneNumber: phoneNumber,
      dateOfBirth: dob,
    }).catch(err => {
      setPasswordError(err.message);
    })  
  }

  const sendVerificationEmail = () => {
    firebase.auth().currentUser.sendEmailVerification(actionCodeSettings).then(function() {                  
      setLinkSent(true);
      setLoading(false);
    }).catch(function(error) {
      // An error happened.
      setLoading(false);
      setEmailError(error.message);
    });      
  }

  const resendEmail = () => {
    setLoading(true);
    clearErrors();
    var user = firebase.auth().currentUser;
    if (user) {
      sendVerificationEmail(); 
    } else if (email.trim() !== "" && password.trim() !== "") {
      firebase.auth().signInWithEmailAndPassword(email, password).then(user => {
        sendVerificationEmail();        
      }).catch(err => {
        setLoading(false);
        setPasswordError(err.message);
      })
    } else {
      setLoading(false);
      setPasswordError("Please provide an email and password")
    }
  }

  const signUpWithNewEmail = () => {
    clearErrors();
    // delete existing user from firebase if they want to sign up with a different email
    var user = firebase.auth().currentUser;
    if (user) {
      firebase.firestore().collection("users").doc(user.uid).delete().then(function() {
        user.delete().then(function() {      
          window.location.reload(false);
        }).catch(err => {
          console.log(err.message)
        })
      }).catch(err => {
        console.log(err.message)
      })
    } else {
      setPasswordError("Not signed in, try again")
    }
  }

  const checkValidPhoneNumber = () => {
    // check the phone number is valid
    //const re = new RegExp('\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$')
    //\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$"
    const re = new RegExp('[^\+(?:[0-9]●?){6,14}[0-9]$]')
    alert(re.test(phoneNumber))    
    return true
  } 

  const phoneSignUp = () => {
    clearErrors();
    setLoading(true);
    //window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    // //console.log("recaptcha...")
    // window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
    //   'size': 'normal',
    //   'callback': (response) => {
    //     // reCAPTCHA solved, allow signInWithPhoneNumber.
    //     // ...
    //     console.log(response)
    //   },
    //   'expired-callback': () => {
    //     // Response expired. Ask user to solve reCAPTCHA again.
    //     // ...
    //     console.log("expired")
    //   }
    // });      
    const appVerifier = window.recaptchaVerifier;
    firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
      .then((confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        //window.confirmationResult = confirmationResult;
        window.confirmationResult = confirmationResult;
        // ...
      }).catch((error) => {
        // Error; SMS not sent
        // ...
      });
  
  }
  
  // to check if it's a phone number or email
  const verifyCode = () => {
    window.confirmationResult.confirm(code).then((result) => {
      // User signed in successfully.
      const user = result.user;
      console.log("DONE ", user)
      // ...
    }).catch((error) => {
      // User couldn't sign in (bad verification code?)
      // ...
    });
  }

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
        {emailError ? <><IonText class="errormsg">{emailError}</IonText><br/></>:null}
        <IonText class="errormsg">OR</IonText><br/>
        <IonInput 
        class="create-input"
        value={phoneNumber} 
        placeholder="Phone Number"
        type="email"
        onIonChange={e => setPhoneNumber(e.detail.value!)}
        >        
        </IonInput>                        
        {phoneError ? <><IonText class="errormsg">{phoneError}</IonText><br/></>:null}
        <IonInput 
        class="create-input" 
        value={fullname} 
        placeholder="Full name"
        type="text"
        onIonChange={e => setFullname(e.detail.value!)}
        >                  
        </IonInput>  
        {fullnameError ? <><IonText class="errormsg">{fullnameError}</IonText><br/></>:null}
        <IonInput 
        class="create-input" 
        value={username} 
        placeholder="Username"
        type="text"
        onIonChange={e => setUsername(e.detail.value!)}
        >                
        </IonInput> 
        {usernameError ? <><IonText class="errormsg">{usernameError}</IonText><br/></>:null}
        <IonInput 
        class="create-input" 
        value={dob} 
        placeholder="Date of birth (dd/mm/yyyy)"
        type="text"
        onIonChange={e => setDob(e.detail.value!)}
        >                
        </IonInput>         
        {dobError ? <><IonText class="errormsg">{dobError}</IonText><br/></>:null}
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
        {passwordError ? <><IonText class="errormsg">{passwordError}</IonText><br/></>:null}
        <IonText class="errormsg">{fieldsMissing ? "Please fill in all the fields" : (null)} </IonText>
        {!linkSent ? <IonButton class="signin-button" id="sign-in-button" onClick={() => handleSignUp()}>Sign up</IonButton> 
        :
        <IonButton class="signin-button" onClick={() => window.location.reload(false)}>Continue</IonButton>}
        {linkSent ? 
        <div className="ion-text-center">
        <IonButton className="yellow-text" onClick={() => signUpWithNewEmail()} >Sign up with new email</IonButton><br/>
        </div>
        : null}         
        <p className="errormsg">
        Have an account?<br/> 
        <IonButton className="yellow-text" href="/signin" >Sign in</IonButton><br/>
        <IonText class="errormsg">OR</IonText><br/>
        <IonButton className="yellow-text" onClick={() => resendEmail()} >Resend verification email</IonButton>
        </p>
        {linkSent ? (
        <IonText class="errormsg">A link has been sent to your email, please click it to verify your email</IonText>
        ) : (null)}    
        </div>     
        <div id="recaptcha-container"></div>
        <div id="my-login-button-target"></div>        
      </IonContent>
      <IonLoading 
      cssClass="loading"
      spinner="bubbles"
      isOpen={loading} 
      onDidDismiss={() => setLoading(false)} />         
    </IonPage>
  )
}

export default SignUp;