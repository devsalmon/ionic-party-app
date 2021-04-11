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
  IonSlide,
} from '@ionic/react';
import { 
  eyeOutline,
  chevronBackSharp
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
  const [email_or_phone, setEmail_or_phone] = useState(
    window.localStorage.getItem("email_or_phone") || ""
  );
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
  const [slide0, setSlide0] = useState(true);
  const slides = useRef(null);

  // When this component renders
  useEffect(() => {  
    clearErrors(); 
    hideBackButton();
    // var signUpStage = window.localStorage.getItem("signUpStage");
    // goToSlide(signUpStage)

    // const script = document.createElement("script");
    // script.src = "https://sdk.snapkit.com/js/v1/login.js"; //Try change this url
    // script.async = true;
    // //script.onload = () => scriptLoaded();
    // document.body.appendChild(script);
 
    //window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
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
      //minimumVersion: '0',
      installApp: true,
    }
  };  

  const hideBackButton = async() => {
    let swiper = await slides.current.getSwiper()
    if (swiper && swiper.isBeginning) {
      setSlide0(true)
    } else {
      setSlide0(false)
    }
    setLoading(false);            
  }

  const goToSlide = async(index) => { 
    window.localStorage.setItem("signUpStage", index)
    await slides.current.getSwiper().then(swiper => {
      swiper.slideTo(index)
    })       
    hideBackButton();
  }

  const prevSlide = async() => {    
    clearErrors();
    let swiper = await slides.current.getSwiper()
    swiper.slidePrev()
    hideBackButton();
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

  const validateEmail = (email) => {
    const re = RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return re.test(email);
  }  

  const validatePhone = (num) => {
    var re = new RegExp(/^\+?([0-9]{1,4})\)?[-. ]?([0-9]{1,4})[-. ]?([0-9]{1,4})$/g);
    return re.test(num);
  }  

  // Enter email/password, username and password.
  const slide0SignUp = async() => {
    console.log(username + password + email_or_phone);
    clearErrors();  
    setLoading(true);
    if (email_or_phone.trim() !== "" && username.trim() && password.trim() !== "") {
      setFieldsMissing(false);    
      if (password.trim().length < 6) { // password too short
        setPasswordError("Password too short")
        setLoading(false);
      } else {
        window.localStorage.setItem("email_or_phone", email_or_phone);
        window.localStorage.setItem("username", username);
        // check which sign up method to use        
        if (validatePhone(email_or_phone)) { 
          // it's a phone number                    
          setSignUpMethod('phone')
          window.localStorage.setItem("signUpMethod", "phone")
          goToSlide(1);
          console.log("Sign up method (phone): " + signUpMethod)
        } else if (validateEmail(email_or_phone)) {
          // it's an email
          setSignUpMethod('email')
          window.localStorage.setItem("signUpMethod", "email")
          goToSlide(1);
          console.log("Sign up method (email): " + signUpMethod)
        } else {
          setEmailError(
            "Invalid format for email or phone number. " +
            "Please enter phone numbers in the form +447123456789 (for UK)"
          )
          setLoading(false)
        }
      }
    } else {
      setLoading(false);
      setFieldsMissing(true);        
    }
  }

  // enter full name or continue with snapchat.
  const slide1SignUp = async() => {
    clearErrors();  
    setLoading(true);
    if (fullname.trim() !== "") {
      console.log(fullname)
      window.localStorage.setItem("fullname", fullname);      
      //go to next slide (DOB)      
      setFieldsMissing(false);
      setPasswordError("");      
      goToSlide(2)
    } else {
      setLoading(false);
      setPasswordError('');
      setFieldsMissing(true);        
    }
  }

  // const checkSnap = () => {
  //   alert("Snap Name: " + window.localStorage.getItem("snap_fullname"))
  //   alert("Bitmo: " + window.localStorage.getItem("bitmoji_avatar"))
  // }

  // enter DOB.
  const slide2SignUp = async() => {
    clearErrors();  
    setLoading(true);
    if (dob.trim() !== "") { // dob is not empty
      setFieldsMissing(false);
      setPasswordError("");
      console.log(dob)
      window.localStorage.setItem("dob", dob);
      //go to next slide (DOB)
      signUpEmailorPhoneandVerify()
    } else {
      setLoading(false);
      setFieldsMissing(true);        
    }
  }

  const signUpEmailorPhoneandVerify = async() => {
    setLoading(true)
    if (signUpMethod === "email") { // they want email sign up
      emailSignUp();
      //triggered 1
    } else if (signUpMethod === "phone") { // they want phone sign up
      console.log("Triggered 1")
      phoneSignUp();
    } else {   // they didn't enter either
      setPasswordError("Enter email or phone number");
      //We should check this field before?
      console.log("signupmethod is neither phone or email")
      goToSlide(0);
    }
  }


  const emailSignUp = async () => {
    clearErrors();
    console.log("Triggered 2")
    console.log("Email: " + email_or_phone)
    if (firebase.auth().currentUser) {
      firebase.firestore().collection("users").where("username", "==", username).get().then(snap => {
        if (snap.empty) { // no duplicate username
          sendVerificationEmail();            
        } else {                      
          setUsernameError("Username is taken, please try another one");            
          goToSlide(0);
        }          
      }).catch(err => {
        console.log(err.message);
        setLoading(false);
      }) 
    } else {
      firebase.auth().createUserWithEmailAndPassword(email_or_phone, password).then(user => {
        firebase.auth().signInWithEmailAndPassword(email_or_phone, password).then(res => {
          firebase.firestore().collection("users").where("username", "==", username).get().then(snap => {
            if (snap.empty) { // no duplicate username
              sendVerificationEmail();            
            } else {                          
              setUsernameError("Username is taken, please try another one");            
              goToSlide(0);
            }          
          }).catch(err => {
            console.log(err.message);
            setLoading(false);
          })            
        }).catch(err => {          
          setPasswordError(err.message);
          goToSlide(0);
        })   
      }).catch(err => {              
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
        goToSlide(0);
      });
    }
  };   

  const sendVerificationEmail = () => {
    firebase.auth().currentUser.sendEmailVerification(actionCodeSettings).then(function() {      
      setLinkSent(true);
      goToSlide(3);
    }).catch(function(error) {
      // An error happened.
      setLoading(false);
      setEmailError(error.message);
    });      
  }

  // const resendEmail = () => {
  //   setLoading(true);
  //   clearErrors();
  //   var user = firebase.auth().currentUser;
  //   if (user) {
  //     sendVerificationEmail(); 
  //   } else if (email_or_phone.trim() !== "" && password.trim() !== "") {
  //     firebase.auth().signInWithEmailAndPassword(email_or_phone, password).then(user => {
  //       sendVerificationEmail();        
  //     }).catch(err => {
  //       setLoading(false);
  //       setPasswordError(err.message);
  //     })
  //   } else {
  //     setLoading(false);
  //     setPasswordError("Please provide an email and password")
  //   }
  // }

  const checkIfVerifiedandSignIn = () => {
    clearErrors();  
    const user = firebase.auth().currentUser;
    user.reload();
    if (!user.emailVerified) { // if user has signed in by pressing a button in sign up, but isn't verified  
      setEmailError(email_or_phone + " is not verified, please click the link in your email to verify your account");                           
    } else {
      console.log("Email verified")
      // if verified...
      firebase.firestore().collection('users').doc(user.uid).set({ // create a user document when a new user signs up
        fullname: fullname,
        username: username,
        email: validateEmail(email_or_phone) ? email_or_phone : "",      
        id: user.uid,
        phoneNumber: validatePhone(email_or_phone) ? email_or_phone : "",
        dateOfBirth: dob,
        //bitmoji: window.localStorage.getItem("bitmoji_avatar")
      }, {merge: true}).then(()=>{ // redirect user to the home page
        setLoading(true);
        window.location.reload(false);
      }).catch(err => {
        setPasswordError(err.message);
      })       
    }
  }

  const phoneSignUp = async() => {
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
    if (firebase.auth().currentUser) {
      firebase.auth().signOut().then(() => {
        firebase.auth().signInWithPhoneNumber(email_or_phone, appVerifier)
          .then((confirmationResult) => {
            console.log("Triggered 3")
            // SMS sent. Prompt user to type the code from the message, then sign the
            // user in with confirmationResult.confirm(code).        
            window.confirmationResult = confirmationResult;
            goToSlide(3);   
            console.log("Phone signed in: " + confirmationResult)
          }).catch((error) => {
            // Error SMS not sent phone number may be wrong
            if (error.code === "auth/invalid-phone-number") {              
              setPhoneError(
                "Invalid format for email or phone number. " +
                "Please enter phone numbers in the form +447123456789 (for UK)"
              )
              goToSlide(0);
            } else {                  
              setPhoneError(error.message);
              goToSlide(0);
            }            
          });
      })
    } else {
      firebase.auth().signInWithPhoneNumber(email_or_phone, appVerifier)
        .then((confirmationResult) => {
          console.log("Triggered 3")
          // SMS sent. Prompt user to type the code from the message, then sign the
          // user in with confirmationResult.confirm(code).        
          window.confirmationResult = confirmationResult;
          goToSlide(3);   
          console.log("Phone signed in: " + confirmationResult)
        }).catch((error) => {
          // Error SMS not sent phone number may be wrong
          if (error.code === "auth/invalid-phone-number") {            
            setPhoneError(
              "Invalid format for email or phone number. " +
              "Please enter phone numbers in the form +447123456789 (for UK)"
            )
            goToSlide(0);
          } else {                
            setPhoneError(error.message);
            goToSlide(0);
          }            
        });
      }
    }  
  
  const verifyCode = async() => {
    setLoading(true);
    clearErrors();
    if (window.confirmationResult) {
      await window.confirmationResult.confirm(code).then((result) => {
        // User signed in successfully.
        //link with fake email
        var phoneEmail = email_or_phone + '@partyemail.com'
        var credential = firebase.auth.EmailAuthProvider.credential(phoneEmail, password);
        //var user = result.user
        result.user.linkWithCredential(credential)      
        .then((usercred) => {
          var user = usercred.user;
          console.log("Account linking success", user);      
          firebase.firestore().collection("users").where("username", "==", username).get().then(snap => {
            if (snap.empty) { // no duplicate username
              addUserInfo();
            } else {              
              setUsernameError("Username is taken, please try another one");              
              goToSlide(0);
            }          
          }).catch(err => {
            console.log(err.message);
            setLoading(false);
          })              
        }).catch((error) => {
          if (error.code === "auth/provider-already-linked") {
            firebase.firestore().collection("users").where("username", "==", username).get().then(snap => {
              if (snap.empty) { // no duplicate username
                addUserInfo();
              } else {              
                setUsernameError("Username is taken, please try another one");              
                goToSlide(0);
              }          
            }).catch(err => {
              console.log(err.message);
              setLoading(false);
            })              
          }
          setLoading(false);
          console.log("Account linking error", error);
        });

      }).catch((error) => {
        // User couldn't sign in (bad verification code?)
        setLoading(false);
        setPhoneError(error.message)      
      });
    } else {
      firebase.auth().signOut().then(() => {
        phoneSignUp();
        setPhoneError("Page refreshed, please try again")
      })      
    }
  }

  const checkPhoneVerified = async() => {
    var user = firebase.auth().currentUser;
    user.reload();
    var ver = await user.emailVerified;
    if (ver === true) {
      setLoading(true);
      window.location.reload(false);
    } else {
      console.log("not verified yet")
    }
  }

  const addUserInfo = () => {
    firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).set({ // create a user document when a new user signs up
      fullname: fullname,
      username: username,
      email: email_or_phone + "@partyemail.com",      
      id: firebase.auth().currentUser.uid,
      phoneNumber: email_or_phone,
      dateOfBirth: dob,
      phoneVerified: true,
      // bitmoji: window.localStorage.getItem("bitmoji_avatar")
    }, {merge: true}).then(() => {
      setInterval(checkPhoneVerified, 3000);         
    }).catch(err => {
      setLoading(false);
      console.log(err.message);
    }) 
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
        {slide0 ? null :<IonButtons slot="start">
          <IonButton slot="start" onClick={() => prevSlide()}>
            <IonIcon icon={chevronBackSharp} /> 
          </IonButton>
        </IonButtons>}
        <IonTitle class="ion-padding signup-toolbar">Sign Up</IonTitle>     
        {slide0 ? null : <IonButtons slot="end">
          <IonButton slot="end">
            <IonIcon /> 
          </IonButton>
        </IonButtons>}        
      </IonToolbar>
      <IonContent id="signin-content">      
      <IonSlides class="sign-up-slides" ref={slides} options={slideOpts}> 

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
              <IonButton className="signin-button" onClick={()=>slide0SignUp()}>Next</IonButton><br/>

              <p className="errormsg">
              Have an account?<br/> 
              <IonButton className="yellow-text" href="/signin" >Sign in</IonButton><br/>            
              </p>
            </div>
          </IonSlide>   

           {/* Slide 1: Continue with snap or enter full name    */}
          <IonSlide>
              {/* <div id="my-login-button-target"></div> */}
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
              <IonButton className="signin-button" onClick={()=>slide1SignUp()}>Next</IonButton><br/>
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
              {/* <div id='sign-in-button'>
              <button>Test</button>
              </div> */}
              {/* <div id='sign-in-button'></div> */}
              {/* <IonButton class="signin-button" id='sign-in-button' onClick={()=>signUpEmailorPhoneandVerify()}>Continue</IonButton> */}
              {/* <div id="recaptcha-container"></div> */}
              </div>
              {/* <button className="signin-button" id='sign-in-button'>Skip</button> */}
              <div id='sign-in-button'></div>
              <IonButton onClick={()=>signUpEmailorPhoneandVerify()}>Skip</IonButton><br/>
              <IonText>This site is protected by reCAPTCHA and the Google
              <a href="https://policies.google.com/privacy"> Privacy Policy </a> and
              <a href="https://policies.google.com/terms"> Terms of Service </a> apply</IonText>
          </IonSlide>

          {/* Slide 3: Confirm email or phone number */}
          <IonSlide>
            <div className="signin-inputs">
            {/* if sign up method is email... */}
             {signUpMethod === 'email' ? 
              <> 
              <IonText>We have sent you an email, please click the link in the email to verify it before continuing</IonText>
              <IonButton className="signin-button" onClick={()=>checkIfVerifiedandSignIn()}>Next</IonButton><br/>
              <IonText>{emailError}</IonText>
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