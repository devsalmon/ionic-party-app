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
import { verify } from 'crypto';

declare global {
  interface Window {
    recaptchaVerifier:any;
    recaptchaWidgetId:any;
    confirmationResult:any;
  }
}

const SignUp: React.FC = () => {

  // Will try to use previously entered email, defaults to an empty string
  // const [email, setEmail] = useState(
  //   window.localStorage.getItem("email") || ""
  // );
  // const [phoneNumber, setPhoneNumber] = useState(
  //   window.localStorage.getItem("phoneNumber") || ""
  // );
  // const [dob, setDob] = useState(
  //   window.localStorage.getItem("dob") || ""
  // );
  // const [fullname, setFullname] = useState(
  //   window.localStorage.getItem("fullname") || ""
  // );
  // const [username, setUsername] = useState(
  //   window.localStorage.getItem("username") || ""
  // );
  // const [signUpMethod, setSignUpMethod] = useState(
  //   window.localStorage.getItem("signUpMethod") || ""
  // );  
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dob, setDob] = useState('');
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [signUpMethod, setSignUpMethod] = useState('');  
  const [password, setPassword] = useState('');
  const [email_or_phone, setEmail_or_phone] = useState('');
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
    // var signUpStage = window.localStorage.getItem("signUpStage");
    // if (signUpStage === "second") {
    //   goToSlide(1)
    // } else if (signUpStage === "third") {
    //   goToSlide(2)
    // } else {
    //   goToSlide(0)
    // }

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
    //     console.log(response)
         //phoneNumberAuth()
       },
       'expired-callback': () => {
         // Response expired. Ask user to solve reCAPTCHA again.
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

  const prevSlide = async() => {
    let swiper = await slides.current.getSwiper();
    swiper.slidePrev()
  }

  const slideOpts = {
    allowTouchMove: false
  };

  const clearErrors = () => {
    setEmailError('');
    setFullnameError('');
    setUsernameError('');
    setPasswordError('');
    setDobError('');
    setPhoneError('');      
    setFieldsMissing(false);  
  }

  // const handleSignUp = async() => {
  //   // sign up function for new users
  //   clearErrors();  
  //   setLoading(true);
  //   if ((email.trim() !== "" || phoneNumber.trim() !== "") && password.trim() !== "") {
  //     setFieldsMissing(false);
  //     setPasswordError("");      
  //     window.localStorage.setItem("email", email);
  //     window.localStorage.setItem("phoneNumber", phoneNumber);
  //     // check which sign up method to use
  //     if (signUpMethod === "email") { // they want email sign up
  //       emailSignUp();
  //     } else if (signUpMethod === "phone") { // they want phone sign up
  //       phoneSignUp();
  //     } else {   // they didn't enter either
  //       setPasswordError("Enter email or phone number")
  //     }        
  //   } else {
  //     setLoading(false);
  //     setPasswordError('');
  //     setFieldsMissing(true);        
  //   }
  // }   

  // Enter email/password, username and password.
  const slide0SignUp = async() => {
    console.log(username + password + email_or_phone)
    clearErrors();  
    setLoading(true);
    if (email_or_phone.trim() !== "" && username.trim() && password.trim() !== "") {
      setFieldsMissing(false);
      setPasswordError("");
      // check which sign up method to use
      var re = new RegExp(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g)
      if (re.test(email_or_phone) === true) { 
        // it's a phone number
        setSignUpMethod('phone')
        goToSlide(1)
        setLoading(false); //move this
      } else {
        // it's an email
        setSignUpMethod('email')
        goToSlide(1)
        setLoading(false); //move this
      }
    } else {
      setLoading(false);
      setPasswordError('');
      setFieldsMissing(true);        
    }
  }

  // enter full name or continue with snapchat.
  const slide1SignUp = async() => {
    clearErrors();  
    setLoading(true);
    if (fullname.trim() !== "") {
      setFieldsMissing(false);
      setPasswordError("");
      console.log(fullname)
      //go to next slide (DOB)
      goToSlide(2)
      setLoading(false); //move this
    } else {
      setLoading(false);
      setPasswordError('');
      setFieldsMissing(true);        
    }
  }

const checkSnap = () => {
  console.log("Snap Name: " + window.localStorage.getItem("snap_fullname"))
  console.log("Bitmo: " + window.localStorage.getItem("bitmoji_avatar"))
}

    // enter DOB.
    const slide2SignUp = async() => {
      clearErrors();  
      setLoading(true);
      if (dob.trim() !== "") {
        setFieldsMissing(false);
        setPasswordError("");
        console.log(dob)
        //go to next slide (DOB)
        //goToSlide(3)
        signUpEmailorPhoneandVerify()
        setLoading(false); //move this
      } else {
        setLoading(false);
        setPasswordError('');
        setFieldsMissing(true);        
      }
    }

  const signUpEmailorPhoneandVerify = () => {
    if (signUpMethod === "email") { // they want email sign up
      emailSignUp();
      //triggered 1
    } else if (signUpMethod === "phone") { // they want phone sign up
      console.log("Triggered 1")
      phoneSignUp();
    } else {   // they didn't enter either
      setPasswordError("Enter email or phone number")
    }
  }

  // const completeUserInfo = () => {
  //   clearErrors();
  //   setLoading(true);
  //   const user = firebase.auth().currentUser;
  //   const userid = user ? user.uid : "";      
  //   var phoneVerified = signUpMethod === "phone" ? true : false;
  //   window.localStorage.setItem("fullname", fullname);
  //   window.localStorage.setItem("username", username);
  //   window.localStorage.setItem("dob", dob);    
  //   // check user has signed in with email or phone number
  //   if (userid !== "") { 
  //     if (fullname.trim() !== "" && email.trim() !== "" && dob.trim() !== "") {
  //       if (moment(dob.trim(), 'DD/MM/YYYY', true).isValid() && moment(dob.trim()).isBefore(new Date())) { // check dob format is valid
  //         firebase.firestore().collection('users').doc(userid).set({ // create a user document when a new user signs up
  //           fullname: fullname,
  //           username: username,
  //           email: email,      
  //           id: userid,
  //           phoneNumber: phoneNumber,
  //           dateOfBirth: dob,
  //         }).then(()=>{
  //           signUpMethod === "email" ? 
  //           sendVerificationEmail() 
  //           :
  //           firebase.firestore().collection('users').doc(userid).update({ // create a user document when a new user signs up
  //             phoneVerified: true
  //           })
  //         }).catch(err => {
  //           setPasswordError(err.message);
  //         })         
  //       } else {
  //         setLoading(false);
  //         setDobError("Wrong format for date of birth")
  //       }
  //     } else {
  //       setLoading(false);
  //       setFieldsMissing(true);
  //     } 
  //   } else {
  //     setLoading(false);
  //     setDobError("Please go back and enter your email/phone number, and password to continue")
  //   }
  // }

  const emailSignUp = async () => {
    clearErrors();
    console.log("Triggered 2")
    console.log("Email: " + email_or_phone)
    firebase.auth().createUserWithEmailAndPassword(email_or_phone, password).then(user => {
      // firebase.auth().signInWithEmailAndPassword(email, password).then(res => {
      //   firebase.firestore().collection("users").where("username", "==", username).get().then(snap => {
      //     setLoading(false);
      //     //changeSlide("userinfo");  
      //     //window.localStorage.setItem("signUpStage", "third");
      //     //does this mean there exists a username that's the same?
      //   }).catch(err => {
      //     console.log(err.message);
      //     setLoading(false);
      //   })            
      //   //go to slide 3
      // }).catch(err => {
      //   setPasswordError(err.message);
      //   setLoading(false);
      // })   
      console.log("Triggered 3")
      sendVerificationEmail()
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
      goToSlide(3)
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

const checkIfVerifiedandSignIn = () => {
  firebase.auth().currentUser.reload()
  if (!firebase.auth().currentUser.emailVerified) { 
    console.log("not verified")
    // if user has signed in by pressing a button in sign up, but isn't verified    
    setPasswordError("Not verified, please click the link in your email to verify your account");           
  } else {
    console.log("Email verified")
    // if verified...
    const userid = firebase.auth().currentUser.uid
    firebase.firestore().collection('users').doc(userid).set({ // create a user document when a new user signs up
      fullname: fullname,
      username: username,
      email: email_or_phone,      
      id: userid,
      phoneNumber: email_or_phone,
      dateOfBirth: dob,
    }).then(()=>{
      if (signUpMethod === "phone")
       firebase.firestore().collection('users').doc(userid).update({ // create a user document when a new user signs up
         phoneVerified: true
       })
    }).catch(err => {
      setPasswordError(err.message);
    })       
     firebase.auth().signInWithEmailAndPassword(email_or_phone, password).then(res => {
      //   firebase.firestore().collection("users").where("username", "==", username).get().then(snap => {
      //     setLoading(false);
      //     //changeSlide("userinfo");  
      //     //window.localStorage.setItem("signUpStage", "third");
      //     //does this mean there exists a username that's the same?
      //   }).catch(err => {
      //     console.log(err.message);
      //     setLoading(false);
      //   })            
      //   //go to slide 3
      console.log("signed in")
       }).catch(err => {
         setPasswordError(err.message);
         setLoading(false);
       })   
}
}

  // const signUpWithNewEmail = () => {
  //   clearErrors();
  //   // delete existing user from firebase if they want to sign up with a different email
  //   var user = firebase.auth().currentUser;
  //   if (user) {
  //     firebase.firestore().collection("users").doc(user.uid).delete().then(function() {
  //       user.delete().then(function() {     
  //         window.localStorage.setItem("signUpStage", "second");
  //         window.localStorage.setItem("email", "");              
  //         window.location.reload(false);
  //       }).catch(err => {
  //         console.log(err.message)
  //       })
  //     }).catch(err => {
  //       console.log(err.message)
  //     })
  //   } else {
  //     setPasswordError("Not signed in, try again")
  //   }
  // }

  // const checkValidPhoneNumber = () => {
  //   // check the phone number is valid
  //   //const re = new RegExp('\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$')
  //   //\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$"
  //   const re = new RegExp('[^\+(?:[0-9]●?){6,14}[0-9]$]')
  //   return re.test(phoneNumber)
  // } 

  const phoneSignUp = () => {
    console.log("Triggered 2")
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
    firebase.auth().signInWithPhoneNumber(email_or_phone, appVerifier)
      .then((confirmationResult) => {
        console.log("Triggered 3")
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).        
        window.confirmationResult = confirmationResult;
        setLoading(false);
        setShowCodeInput(true);
        goToSlide(3);
        console.log("Phone signed in: " + confirmationResult)
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
      //changeSlide("userinfo"); 
     //window.localStorage.setItem("signUpStage", "third");        
      //link with fake email
      var phoneEmail = email_or_phone + '@partyemail.com'
      var credential = firebase.auth.EmailAuthProvider.credential(phoneEmail, password);
      //var user = result.user
      result.user.linkWithCredential(credential)
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

  // const changeSlide = async(method) => {
  //   const swiper = await slides.current.getSwiper();    
  //   if (method === "email") {
  //     setSignUpMethod('email');
  //     window.localStorage.setItem("signUpMethod", "email");
  //     window.localStorage.setItem("signUpStage", "second");
  //     swiper.slideNext()
  //   } else if (method === "phone") {
  //     setSignUpMethod('phone');
  //     window.localStorage.setItem("signUpMethod", "phone");
  //     window.localStorage.setItem("signUpStage", "second");
  //     swiper.slideNext()
  //   } else if (method === "userinfo") {
  //     swiper.slideNext()
  //   }
  // }

  return (
    <IonPage>
      <IonToolbar class="ion-padding">
        <IonButton slot="start" onClick={() => prevSlide()}>Back</IonButton>
        <IonTitle class="ion-padding">Sign Up</IonTitle>     
      </IonToolbar>
      <IonContent id="signin-content">      
      <IonSlides ref={slides} options={slideOpts}> 

          {/* Slide 0: Email/Phone, username and password.               */}
          <IonSlide>               
            <div className="signin-inputs">
              {/* <IonButton class="custom-button" onClick={() => changeSlide('email')}>Sign up with email</IonButton><br/>
              <IonText class="errormsg">OR</IonText><br/>
              <IonButton class="custom-button" onClick={() => changeSlide('phone')}>Sign up with phone</IonButton> */}
              <IonInput 
              class="create-input"
              value={email_or_phone} 
              placeholder="Mobile Number or Email"
              type="email"
              onIonChange={e => setEmail_or_phone(e.detail.value!)}
              >        
              </IonInput> 
              {emailError ? <><IonText class="errormsg">{emailError}</IonText><br/></>:null}
              {phoneError ? <><IonText class="errormsg">{phoneError}</IonText><br/></>:null}
              <IonInput 
              class="create-input" 
              value={username} 
              placeholder="Username"
              type="text"
              onIonChange={e => setUsername(e.detail.value!)}
              ></IonInput>
              {usernameError ? <><IonText class="errormsg">{usernameError}</IonText><br/></>:null}
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
              <IonButton className="signin-button" onClick={()=>slide0SignUp()}>Next</IonButton>

              <p className="errormsg">
              Have an account?<br/> 
              <IonButton className="yellow-text" href="/signin" >Sign in</IonButton><br/>            
              </p>
            </div>
          </IonSlide>   

           {/* Slide 1: Continue with snap or enter full name    */}
          <IonSlide>
              <div id="my-login-button-target"></div>
              <IonText>OR</IonText>      
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
              <IonText class="errormsg">{fieldsMissing ? "Please fill in all the fields" : (null)} </IonText>
              <IonButton className="signin-button" onClick={()=>slide1SignUp()}>Next</IonButton>
              <IonButton className="signin-button" onClick={()=>checkSnap()}>Log Snap info</IonButton>
              </div>
          </IonSlide>   

          {/* Slide 2: Enter DOB or skip */}
          <IonSlide>     
              <div className="signin-inputs">
              <IonInput 
              class="create-input" 
              value={dob} 
              placeholder="Date of birth (dd/mm/yyyy)"
              type="text"
              onIonChange={e => setDob(e.detail.value!)}
              >                
              </IonInput>         
              {dobError ? <><IonText class="errormsg">{dobError}</IonText><br/></>:null}
              <IonButton className="signin-button" onClick={()=>slide2SignUp()}>Next</IonButton>
              <IonText class="errormsg">{fieldsMissing ? "Please fill in all the fields" : (null)} </IonText>
              <IonButton class="signin-button" id = 'sign-in-button' onClick={()=>signUpEmailorPhoneandVerify()}>Continue</IonButton>  
              <div id="recaptcha-container"></div>
              </div>
              <IonButton onClick={()=>signUpEmailorPhoneandVerify()}>Skip</IonButton>
          </IonSlide>     

          {/* Slide 3: Confirm email or phone number */}
          <IonSlide>
            <div className="signin-inputs">
            {/* if sign up method is email... */}
             {signUpMethod === 'email' ? 
              <> 
              <IonText>We have sent you an email...</IonText>
              <IonButton className="signin-button" onClick={()=>checkIfVerifiedandSignIn()}>Next</IonButton>
              </>
              // else sign up method is phone...
             : 
              <>
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
              {phoneError ? <><IonText class="errormsg">{phoneError}</IonText><br/></>:null}
              </>   
              }
              </div>
          </IonSlide>           
          
          {/* <IonSlide>     
              <div id="my-login-button-target"></div>
              <IonText>OR</IonText>      
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
              <><IonText class="errormsg">{fieldsMissing ? "Please fill in all the fields" : (null)} </IonText><br/></>
              {linkSent ? (
              <><IonText class="errormsg">A link has been sent to your email, please click it to verify your email</IonText><br/></>
              ) : (null)}                
              {linkSent ? 
              <IonButton class="signin-button" onClick={()=>window.location.reload(false)}>Complete sign up</IonButton>       
              :
              <IonButton className="signin-button" onClick={()=>completeUserInfo()}>Continue</IonButton>
              }
              <br/>
              {signUpMethod === "email" ? <IonButton className="yellow-text" onClick={() => resendEmail()} >Resend verification email</IonButton>:null}                
              </div>
          </IonSlide>                   */}

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