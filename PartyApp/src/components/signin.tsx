import React, { useState, useEffect} from 'react';
import firebase from '../firestore';
// import PhoneInput from 'react-phone-number-input';
import {
  IonButton,
  IonPage,
  IonContent, 
  IonToolbar, 
  IonIcon,
  IonTitle,
  IonInput, 
  IonText,
  IonPopover,
  IonRow,
  IonBackButton,
  IonButtons,
  IonToast
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

declare global {
  interface Window {
    recaptchaVerifier:any;
    recaptchaWidgetId:any;
    confirmationResult:any;
  }
}

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
  const [phonePopover, setPhonePopover] = useState(false);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordToast, setNewPasswordToast] = useState(false);
  const [newPasswordError, setNewPasswordError] = useState("");

  useEffect(() => {
    clearErrors();
    if (firebase.auth().currentUser && !firebase.auth().currentUser.emailVerified) { 
      var email = firebase.auth().currentUser.email
      // if user has signed in by pressing a button in sign up, but isn't verified    
      setPasswordError(email + " is not verified yet, please click the link in your email to verify your account");           
    }
    
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
      'size': 'invisible',
      'callback': (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        console.log("Response: " + response)
        //signUpEmailorPhoneandVerify()
        //phoneSignUp()
        //phoneNumberAuth()
      },
      'expired-callback': () => {
        // Response expired. Ask user to solve reCAPTCHA again.
      }
    });

    window.recaptchaVerifier.render().then(function (widgetId) {
      window.recaptchaWidgetId = widgetId;   
    }); 
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

  const validateEmail = (email) => {
    const re = RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return re.test(email);
  }  

  const validatePhone = (num) => {
    var re = new RegExp(/^\+?([0-9]{1,4})\)?[-. ]?([0-9]{1,4})[-. ]?([0-9]{1,4})$/g);
    if (num[0] === "0" && num[1] === "7") {
      var temp = "+44" + num.slice(1);
      setEmailorphone(temp)
      console.log(temp)
      return true 
    } else {
      return re.test(num);
    }    
  }  

  const resetPassword = () => {  
    clearErrors();  
    if (emailorphone.trim() === "") { // ask user to provide an email address
      setEmailorphoneError("Please provide an email or phone number before resetting your password");
      setForgotPassword(false); // remove popover
    } else {
      setEmailorphoneError("")
      //check if phone or email
      if (validatePhone(emailorphone)) { 
        console.log("phone")
        //send code to phone, and reset password.
        const appVerifier = window.recaptchaVerifier;
        firebase.auth().signInWithPhoneNumber(emailorphone, appVerifier)
          .then((confirmationResult) => {
            // SMS sent. Prompt user to type the code from the message, then sign the
            // user in with confirmationResult.confirm(code).        
            window.confirmationResult = confirmationResult;
            //goToSlide(3);   
            //nextSlide();
            console.log("Phone signed in: " + confirmationResult)
            setPhonePopover(true);
            // IF THIS STAGE IS REACHED, A POP UP SHOULD APPEAR ASKING USER TO ENTER CODE,
            // IF CODE IS CORRECT, THEN updatePassword CAN BE USED TO CHOOSE A NEW PASSWORD AND SAVE A NEW PASSWORD
            console.log("Important stage reached")
          }).catch((error) => {
            // Error SMS not sent phone number may be wrong
            if (error.code === "auth/invalid-phone-number") {              
              //setPhoneError(
              //  "Invalid format for email or phone number. " +
              //  "Please enter phone numbers in the form +447123456789 (for UK)"
             // )
              //goToSlide(0);
            } else {                  
             // setPhoneError(error.message);
            }
          })
          } else if (validateEmail(emailorphone)) {
        //reset email password.
      firebase.auth().sendPasswordResetEmail(emailorphone, actionCodeSettings).then(() => {
        setEmailSent(true);
        setForgotPassword(false); // remove popover
      }).catch(function(error) {
        setPasswordError(error.message);           
        setForgotPassword(false); // remove popover                                   
      });  
    }        
    }
  }

const verifyCodeAndNewPassword = async() => {
    //setLoading(true);
    clearErrors();
    if (window.confirmationResult && newPassword.trim().length > 6) {  
      await window.confirmationResult.confirm(code).then((result) => {
        // User signed in successfully.
        //link with fake email
        //UPDATE PASSWORD.
        var user = firebase.auth().currentUser;  
        user.updatePassword(newPassword).then(function() {
          setPhonePopover(false);
          setNewPasswordToast(true);
          setNewPassword('');
          //setLoading(false);
        }).catch(function(error) {
          setNewPasswordError(error.message);
          //setLoading(false);
        });             
      }).catch((error) => {
        // User couldn't sign in (bad verification code?)
        //setLoading(false);
        setCodeError(error.message);   
      });
    } else {
      setNewPasswordError("Password may be too short, has to be over 6 characters")   
    }
  }  

  const handleLogin = () => {
    // normal login function 
    clearErrors();   
    // check all fields have a value 
    if (emailorphone.trim() === "" || password.trim() === "") {
      setFieldsMissing(true);
    } else if (firebase.auth().currentUser && !firebase.auth().currentUser.emailVerified) {
      setPasswordError("Not verified, please click the link in your email to verify your account");      
    } else { 
      if (validatePhone(emailorphone)) { 
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
            setEmailorphoneError("User not found or is disabled, please check you have signed up to Motive before trying to sign in.");
            break;
          case "auth/wrong-password":
            setPasswordError("The password you entered is incorrect, please try again or reset your password");
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
        console.log("signed in with email and password", firebase.auth().currentUser.emailVerified)      
      })
      .catch(err => {
        switch(err.code){
          case "auth/invalid-email":
            setEmailorphoneError("Phone number not found or not formatted correctly")
          case "auth/user-disabled":
          case "auth/user-not-found":
            setEmailorphoneError("User not found or is disabled, please check you have signed up to Motive before trying to sign in.");
            break;
          case "auth/wrong-password":
            setPasswordError("The password you entered is incorrect, please try again or reset your password");
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
        <IonButtons slot="start">
          <IonBackButton text="" color="warning" defaultHref="/welcomepage" />
        </IonButtons>
        <IonTitle class="ion-padding">Sign In</IonTitle>
      </IonToolbar>
      <IonContent id="signin-content">   
        <div className="signin-inputs">
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
          <div id='sign-in-button'></div>
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
          <div id='sign-in-button'></div>
          <IonButton onClick={() => setForgotPassword(false)}>No</IonButton>
          <IonButton onClick={() => resetPassword()}>Yes</IonButton>
          </IonPopover>         
          <IonPopover
            cssClass="popover"        
            isOpen={phonePopover}
            backdropDismiss={false}
          > 
          <IonText>Enter the phone verification code which we just sent you</IonText><br/>          
          <IonInput 
          class="create-input" 
          placeholder="Verification code" 
          value={code} 
          type="text"
          onIonChange={e => setCode(e.detail.value!)}          
          ></IonInput>
          {codeError ? <><IonText class="errormsg">{codeError}</IonText><br/></>:null}
          <IonText className="ion-padding">Enter your new password</IonText><br/>          
          <IonRow class="ion-align-items-center">
            <IonInput 
            class="create-input" 
            value={newPassword} 
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            onIonChange={e => setNewPassword(e.detail.value!)}
            >
            </IonInput>   
            <IonButton onClick={()=>setShowPassword(!showPassword)}>
              <IonIcon slot="icon-only" icon={eyeOutline} />
            </IonButton>                  
          </IonRow>         
          <IonText>{newPasswordError}</IonText><br/>
          <IonButton onClick={() => setPhonePopover(false)}>Cancel</IonButton>
          <IonButton onClick={() => verifyCodeAndNewPassword()}>Done</IonButton>
          </IonPopover>        
          <IonToast
            isOpen={newPasswordToast}
            cssClass={"refresh-toast"}
            onDidDismiss={() => setNewPasswordToast(false)}
            position = 'bottom'
            message="Password updated! Try signing in."
          />                 
        </div>          
      </IonContent>
    </IonPage>
  )
}

export default SignIn;