import React, { useState, useEffect, useRef} from 'react';
//import Script from 'react-load-script'
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
  IonSlides,
  IonSlide
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
  const [signUpMethod, setSignUpMethod] = useState(
    window.localStorage.getItem("signUpMethod") || ""
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
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [code, setCode] = useState('');
  const slides = useRef(null);

  // When this component renders
  useEffect(() => {  
    clearErrors(); 
    var signUpStage = window.localStorage.getItem("signUpStage");
    if (signUpStage === "second") {
      goToSlide(1)
    } else if (signUpStage === "third") {
      goToSlide(2)
    } else {
      goToSlide(0)
    }

    const script = document.createElement("script");
    script.src = "https://sdk.snapkit.com/js/v1/login.js"; //Try change this url
    script.async = true;
    //script.onload = () => scriptLoaded();
    document.body.appendChild(script);
 
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    //console.log("recaptcha...")
     window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
       'size': 'invisible',
       'callback': (response) => {
         // reCAPTCHA solved, allow signInWithPhoneNumber.
         // ...
    //     console.log(response)
         //phoneNumberAuth()
       },
       'expired-callback': () => {
         // Response expired. Ask user to solve reCAPTCHA again.
         // ...
    //     console.log("expired")
       }
     });
     window.recaptchaVerifier.render().then(function (widgetId) {
       window.recaptchaWidgetId = widgetId;   
     }); 
  }, []);  

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

  const goToSlide = async(index) => {
    let swiper = await slides.current.getSwiper();    
    swiper.slideTo(index)    
  }

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

  const handleSignUp = async() => {
    // sign up function for new users
    clearErrors();  
    setLoading(true);
    if ((email.trim() !== "" || phoneNumber.trim() !== "") && password.trim() !== "") {
      setFieldsMissing(false);
      setPasswordError("");      
      window.localStorage.setItem("email", email);
      window.localStorage.setItem("phoneNumber", phoneNumber);
      // check which sign up method to use
      if (signUpMethod === "email") { // they want email sign up
        emailSignUp();
      } else if (signUpMethod === "phone") { // they want phone sign up
        phoneSignUp();
      } else {   // they didn't enter either
        setPasswordError("Enter email or phone number")
      }        
    } else {
      setLoading(false);
      setPasswordError('');
      setFieldsMissing(true);        
    }
  }   

  const completeUserInfo = () => {
    clearErrors();
    setLoading(true);
    const user = firebase.auth().currentUser;
    const userid = user ? user.uid : "";      
    var phoneVerified = signUpMethod === "phone" ? true : false;
    window.localStorage.setItem("fullname", fullname);
    window.localStorage.setItem("username", username);
    window.localStorage.setItem("dob", dob);    
    // check user has signed in with email or phone number
    if (userid !== "") { 
      if (fullname.trim() !== "" && email.trim() !== "" && dob.trim() !== "") {
        if (moment(dob.trim(), 'DD/MM/YYYY', true).isValid() && moment(dob.trim()).isBefore(new Date())) { // check dob format is valid
          firebase.firestore().collection('users').doc(userid).set({ // create a user document when a new user signs up
            fullname: fullname,
            username: username,
            email: email,      
            id: userid,
            phoneNumber: phoneNumber,
            dateOfBirth: dob,
          }).then(()=>{
            signUpMethod === "email" ? 
            sendVerificationEmail() 
            :
            firebase.firestore().collection('users').doc(userid).update({ // create a user document when a new user signs up
              phoneVerified: true
            })
          }).catch(err => {
            setPasswordError(err.message);
          })         
        } else {
          setLoading(false);
          setDobError("Wrong format for date of birth")
        }
      } else {
        setLoading(false);
        setFieldsMissing(true);
      } 
    } else {
      setLoading(false);
      setDobError("Please go back and enter your email/phone number, and password to continue")
    }
  }

  const emailSignUp = async () => {
    clearErrors();
    firebase.auth().createUserWithEmailAndPassword(email, password).then(user => {
      firebase.auth().signInWithEmailAndPassword(email, password).then(res => {
        firebase.firestore().collection("users").where("username", "==", username).get().then(snap => {
          setLoading(false);
          changeSlide("userinfo");  
          window.localStorage.setItem("signUpStage", "third");
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
  };   

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
    return re.test(phoneNumber)
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
        window.confirmationResult = confirmationResult;
        setLoading(false);
        setShowCodeInput(true);
      }).catch((error) => {
        // Error; SMS not sent
        setLoading(false);
        setPhoneError(error.message)
        // ...
      });
  
  }
  
  const verifyCode = () => {
    setLoading(true);
    clearErrors();
    window.confirmationResult.confirm(code).then((result) => {
      // User signed in successfully.
      setLoading(false);
      changeSlide("userinfo"); 
      window.localStorage.setItem("signUpStage", "third");  
      
      //link with fake email
      var phoneEmail = phoneNumber + '@partyemail.com'
      var credential = firebase.auth.EmailAuthProvider.credential(phoneEmail, password);
      var user = result.user
      user.linkWithCredential(credential)
  .then((usercred) => {
    var user = usercred.user;
    console.log("Account linking success", user);
  }).catch((error) => {
    console.log("Account linking error", error);
  });



    }).catch((error) => {
      // User couldn't sign in (bad verification code?)
      setLoading(false);
      setPhoneError(error.message)      
    });
  }

  const changeSlide = async(method) => {
    const swiper = await slides.current.getSwiper();    
    if (method === "email") {
      setSignUpMethod('email');
      window.localStorage.setItem("signUpMethod", "email");
      window.localStorage.setItem("signUpStage", "second");
      swiper.slideNext()
    } else if (method === "phone") {
      setSignUpMethod('phone');
      window.localStorage.setItem("signUpMethod", "phone");
      window.localStorage.setItem("signUpStage", "second");
      swiper.slideNext()
    } else if (method === "userinfo") {
      swiper.slideNext()
    }
  }

  return (
    <IonPage>
      <IonToolbar class="ion-padding">
        <IonTitle class="ion-padding">Sign Up</IonTitle>
      </IonToolbar>
      <IonContent id="signin-content">      
      <IonSlides ref={slides}>                   
          <IonSlide>               
            <div className="signin-inputs">
              <IonButton class="custom-button" onClick={() => changeSlide('email')}>Sign up with email</IonButton><br/>
              <IonText class="errormsg">OR</IonText><br/>
              <IonButton class="custom-button" onClick={() => changeSlide('phone')}>Sign up with phone</IonButton>
              <p className="errormsg">
              Have an account?<br/> 
              <IonButton className="yellow-text" href="/signin" >Sign in</IonButton><br/>            
              </p>
            </div>
          </IonSlide>              
          <IonSlide>
            <div className="signin-inputs">
              {/* if sign up method is email... */}
             {signUpMethod === 'email' ? 
              <>
              <IonInput 
              class="create-input"
              value={email} 
              placeholder="Email"
              type="email"
              onIonChange={e => setEmail(e.detail.value!)}
              >        
              </IonInput> 
              {emailError ? <><IonText class="errormsg">{emailError}</IonText><br/></>:null}
              </>
              // else sign up method is phone...
             : 
              <>
              <IonInput 
              class="create-input"
              value={phoneNumber} 
              placeholder="Phone Number"
              type="email"
              onIonChange={e => setPhoneNumber(e.detail.value!)}
              >        
              </IonInput>                        
              {phoneError ? <><IonText class="errormsg">{phoneError}</IonText><br/></>:null}
              </>
             }
             {showCodeInput ? 
              <IonRow class="ion-align-items-center">
              <IonInput 
              class="create-input" 
              value={code} 
              placeholder="SMS verification code"
              onIonChange={e => setCode(e.detail.value!)}
              >
              </IonInput>   
              <IonButton class="yellow-text" onClick={()=>verifyCode()}>
                Verify
              </IonButton>                  
              </IonRow>
              :
              null}
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
              
              {/* {signUpMethod === 'email' ?
              <>
              <IonButton class="signin-button" onClick={() => handleSignUp()}>Continue</IonButton>
              </>
              :
              <> */}
              <IonButton class="signin-button" id = 'sign-in-button' onClick={() => handleSignUp()}>Continue</IonButton>  
              <div id="recaptcha-container"></div>

              {linkSent ?
              <><IonButton className="yellow-text" onClick={() => signUpWithNewEmail()} >Sign up with new email</IonButton><br/></>
              : null}    
              {signUpMethod === "email" ? <IonButton className="yellow-text" onClick={() => resendEmail()} >Resend verification email</IonButton>:null}             
              <br/>
              {linkSent ? (
              <IonText class="errormsg">A link has been sent to your email, please click it to verify your email</IonText>
              ) : (null)}    
            </div>                    
          </IonSlide>   
          <IonSlide>               
              <div className="signin-inputs">
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
              {passwordError ? <><IonText class="errormsg">{passwordError}</IonText><br/></>:null}
              <IonText class="errormsg">{fieldsMissing ? "Please fill in all the fields" : (null)} </IonText>
              {linkSent ? (
              <IonText class="errormsg">A link has been sent to your email, please click it to verify your email</IonText>
              ) : (null)}                
              {linkSent ? 
              <IonButton class="signin-button" onClick={()=>window.location.reload(false)}>Complete sign up</IonButton>       
              :
              <>
              <IonButton className="signin-button" onClick={()=>completeUserInfo()}>Continue</IonButton>
              <div id="my-login-button-target"></div></>
              }
              </div>
          </IonSlide>                  
        </IonSlides>    
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