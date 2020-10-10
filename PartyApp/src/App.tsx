import React, { useState, useEffect} from 'react';
import Users from './components/users';
import CreateParty from './components/createparty';
import Gallery from './components/gallery';
import Memory from './components/memory';
import People from './components/profile';
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion';
import { Route, Redirect } from 'react-router-dom';
import {useDocument, useCollection} from 'react-firebase-hooks/firestore';
import { RefresherEventDetail } from '@ionic/core';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRefresher, 
  IonRefresherContent,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs, 
  IonItem,
  IonList, 
  IonButton,
  IonPage,
  IonContent, 
  IonToolbar, 
  IonBackButton,
  IonButtons, 
  IonTitle,
  IonSearchbar,
  IonRow,
  IonCol,
  IonInput, 
  IonText,
  IonToast,
  IonRippleEffect,
  IonLoading,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { 
  home, 
  personAddSharp,   
  cameraSharp,
  chevronDownCircleOutline,
  cloudUploadSharp,
  chevronBackSharp,  
} from 'ionicons/icons';
import {Plugins} from '@capacitor/core';
import {useCamera} from '@ionic/react-hooks/camera';
import {CameraResultType, CameraSource} from '@capacitor/core';
import './App.css'
import firebase from './firestore'
import moment from 'moment'
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
import './variables.css';
import algoliasearch from 'algoliasearch/lite';
import Profile from './components/profile';
// once finished, run ionic build then npx cap add ios and npx cap add android

const SignIn = () => {

  // Signs-in Messaging with GOOGLE POP UP
const SignInGooglepu = async() => {
  // Initiate Firebase Auth.
  // Sign into Firebase using popup auth & Google as the identity provider.
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
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
  });
  // Get the signed-in user's profile pic and name.
  //var profilePicUrl = getProfilePicUrl();
  //var userName = getUserName();
  // Set the user's profile pic and name.
  //document.getElementById('user-pic').style.backgroundImage = 'url(' + addSizeToGoogleProfilePic(profilePicUrl) + ')';
  //document.getElementById('user-name').textContent = userName;
}

  const [email] = useState<string>('');
  const [password] = useState<string>('');

  return (
    <IonPage>
      <IonToolbar>
        <IonTitle size="large">Sign in</IonTitle>
      </IonToolbar>
      <IonContent>
        <IonItem class="create-card" lines="none">
          <IonInput class="create-input" value={email} placeholder="username"></IonInput>
        </IonItem>
        <IonItem class="create-card" lines="none">
          <IonInput class="create-input" value={password} placeholder="password"></IonInput>
        </IonItem>
        <IonItem class="create-card" lines="none">
          <IonButton class="create-button">Login</IonButton>  
        </IonItem>        
        <IonItem class="create-card" lines="none">
          <IonButton class="create-button" onClick={() => SignInGooglepu()}>Google SignIn</IonButton>  
        </IonItem>
      </IonContent>
    </IonPage>
  )
}

//TODO - 
// Add friends
// delete party document in firebase after it's happened

const MemoryList = () => {

  const [id, setID] = useState<string>('');
  const [inGallery, setInGallery] = useState(false);
  const [value, loading, error] = useCollection(
    firebase.firestore().collection("parties").orderBy("date", "asc"), 
  );

  // if memory card clicked, go to gallery
  const enter = (id) => {
    setInGallery(true)
    setID(id)
  }  

  const today = new Date();
  const yourparties = [];
  const otherparties = [];

  value && value.docs.map(doc => {
    // if the party has happened display on memories 
    if (moment(doc.data().endTime).isBefore(today) && doc.data().host == firebase.auth().currentUser.displayName) {           
      yourparties.push(doc)   
    } else if (moment(doc.data().endTime).isBefore(today)) {
      otherparties.push(doc)
    }
  });

  if (inGallery) {
    return(
      !loading && (
        <>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton color="warning" fill="clear" onClick={() => setInGallery(false)}>
              <IonIcon icon={chevronBackSharp} />
            </IonButton>
          </IonButtons>
          <IonTitle>Memories</IonTitle>
          <IonButtons slot="end">
            <IonButton disabled></IonButton>
          </IonButtons>
        </IonToolbar>
        <Gallery id={id} key={id}/>
        </>
      )
    )
  } else {
    return(
      <>
        <IonToolbar>
          <IonTitle>Memories</IonTitle>
        </IonToolbar>
        <IonContent>
        <IonText class="ion-padding-start">Your parties</IonText>
        {yourparties.map(doc => {
          return(<Memory doc={doc} key={doc.id} click={() => enter(doc.id)}/>)          
        })}
        {yourparties.length > 0 ? <IonText> <br/> </IonText> : <IonText class="white-text"><br/><br/>No hosted parties... <br/><br/></IonText>}
        <IonText class="ion-padding-start">Parties attended</IonText>
        {otherparties.map(doc => {
          return(<Memory doc={doc} key={doc.id} click={() => enter(doc.id)}/>)          
        })}        
        </IonContent>
      </>
    )
  }
}
const Party = ({doc, live, classname}) => {
  // party card

  const [showToast, setShowToast] = useState(false);
  const [picture, setPicture] = useState<string>('')
  const {getPhoto} = useCamera(); 
  const [isLive, setIsLive] = useState(live);

  const onSave = async() => { 
    if (picture !== "") {
    await collectionRef.doc(doc.id).collection('pictures').add({
        picture: picture,
        createdAt: moment(new Date()).format('LT'),
    })
      .then(function() {
        setShowToast(true)
      })
      .catch(function(error) {
        console.log(error)
      });
      setPicture('');
    }
  }  

  // TODO - add IOS AND ANDROID permissions from pwa elements
  const takePhoto = async() => {
    const cameraPhoto = await getPhoto({
      allowEditing: true,      
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      quality: 100
    });
    const photo = `data:image/jpeg;base64,${cameraPhoto.base64String}`
    return(setPicture(photo));  
  }    

  const collectionRef = firebase.firestore().collection("parties");
  let data = doc.data()

  let liveParty // not live initially
  if (isLive) {
    liveParty = <IonRow> 
                <IonCol>
                  <IonButton class="custom-button" expand="block" onClick={takePhoto}>
                    <IonIcon icon={cameraSharp} />
                  </IonButton>   
                </IonCol>
                <IonCol>
                  <IonButton class="custom-button" expand="block" onClick={onSave}>
                    <IonIcon icon={cloudUploadSharp} />
                  </IonButton>   
                </IonCol> 
                </IonRow>
  } else {};

  return(
    <AccordionItem className={classname}>
      <AccordionItemHeading>
          <AccordionItemButton className="ion-padding">
            <IonRow>
              <IonCol size="2.5" class="date-box">
                <IonText>{data.month} <br/></IonText>   
                <IonText class="day-text">{data.day}</IonText> 
              </IonCol>
              <IonCol>            
                <IonText>{data.title} <br/></IonText>  
                <IonText class="white-text">{data.location}</IonText><br/>
                <IonText class="white-text">By {data.host}</IonText>
              </IonCol>                    
            </IonRow>   
            {/*if live then display camera buttons */}            
            {liveParty}                
          </AccordionItemButton>
      </AccordionItemHeading>
      <AccordionItemPanel>        
        <IonItem>Location: {data.location} (maps plugin)</IonItem>        
        <IonItem>Starts: {moment(data.dateTime).format('LT')}</IonItem>        
        <IonItem>Ends: {moment(data.endTime).format('LT')}</IonItem>
        <IonItem>Pending invites: 10291</IonItem> 
        <IonItem>Accepted Invites: 138430</IonItem>               
        <IonLabel className="ion-padding" color="warning">Details:</IonLabel>
        <IonItem >{data.details}</IonItem>        
      </AccordionItemPanel>
      <IonToast 
      isOpen={showToast}
      onDidDismiss={() => setShowToast(false)}
      duration={2000}
      message="Picture uploaded!"
      position="bottom"
    />       
    </AccordionItem>
  )
}
const PartyList = () => {

  const [value, loading, error] = useCollection(
    firebase.firestore().collection("parties").orderBy("dateTime", "asc"), //order by parties closest to today's date 
  );

  const today = new Date()
  return(
    <IonContent>
      <Accordion allowZeroExpanded={true} allowMultipleExpanded={true}>   
      {value && value.docs.map(doc => {
        // if the party is now, display in live parties with camera function
        let data = doc.data()
        if (moment(today).isBetween(data.dateTime, data.endTime)) {
          return(
            !loading && (              
              <>
              <IonTitle color="danger">LIVE!</IonTitle>              
              <Party doc={doc} key={doc.id + "live"} live={true} classname="live-item"/>              
              <br/>
              </>
            )
          )      
        } if (moment(data.dateTime).isAfter(today)) {
            return(
              !loading && (   
                <Party doc={doc} key={doc.id} live={false} classname="accordion-item"/>
              )
            )   
        } else {return null}
      })} 
      </Accordion>      
    </IonContent>
  )
}
const Create: React.FC = () => {
  
  const [current, setCurrent] = useState(null); // used to reset input form values
  return(
    <IonPage>
      <CreateParty initialValue={current} clear={() => setCurrent(null)}/>
    </IonPage>
  )
}

// const acceptFriend = (objectID) => {
//   const collectionRef = firebase.firestore().collection("friends_requests");
//   console.log("TEST122")
//   var sender_user_id = firebase.auth().currentUser.uid
//   var receiver_user_id = objectID
  
//   var date = moment(new Date()).format('LLL')

//   //create doc with sender's id and adds receiver's id to collection.
//   collectionRef.doc(sender_user_id).collection(receiver_user_id).add(
//     {date: date})

//     //if successful
//     .then(function(docRef) {
//       //console.log("Document written with ID: ", docRef.id);
//       //if successful, create doc w receiver's id and add sender's id to collection
//       collectionRef.doc(receiver_user_id).collection(sender_user_id).add(

//         {date: date})
        
//         //if successful
//         .then(function(docRef) {
//           //currentState = "request_received"
//           //setaddBtnDisabled(true); //disables add friend button
//           //setcancBtnDisabled(false); //enalbes cancel request button
//         })

//         //if unsuccessful
//         .catch(function(error) {
//           console.error("Error adding document: ", error);
//       }); 
//     })

//   //if unsuccessful
//   .catch(function(error) {
//       console.error("Error adding document: ", error);
//   });

// }

const Request = ({id}) => {
  // notification item
  const [name, setName] = useState(''); // name of person who requested

  const userRef = firebase.firestore().collection("users").doc(id); // get document of person who requested
  userRef.get().then(function(doc) {
    if (doc.exists) { 
      setName(doc.data().name) // set name to the name in that document
    } 
  }).catch(function(error) {
    console.log(error);
  });

  return(
    <IonItem>
      <IonText>{name} wants to be friends</IonText>
      <IonButton>Accept</IonButton>
    </IonItem>
  )
}

//This just handles the requests once they have been made.
const FriendRequests = () => {

  const collectionRef = firebase.firestore().collection("friend_requests");   
  const [reqs, setReqs] = useState([]);

  //get current user
  var current_user = firebase.auth().currentUser.uid

  //Inside friend_requests, inside current user's doc. HERE
  collectionRef.doc(current_user).onSnapshot(function(doc) {
    if (doc.exists) {
        console.log("req - Document data:", doc.data().request_from[0]);
        setReqs(doc.data().request_from[0])
        console.log(reqs)
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
  })

  //On refresh...
  function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    console.log('Begin async operation');

    //get current user
    var current_user = firebase.auth().currentUser.uid

    //Inside friend_requests, inside current user's doc. HERE
    collectionRef.doc(current_user).get().then(function(doc) {
      if (doc.exists) {
          var req_id = doc.data().request_from[0]
          console.log("req - Document data:", req_id);
          setReqs(req_id)
          console.log(reqs)
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
  }).catch(function(error) {
      console.log("Error getting document:", error);
  });

    setTimeout(() => {
      console.log('Async operation has ended');
      event.detail.complete();
    }, 2000);
  }    

  return(
    <IonContent>
    <IonRefresher slot="fixed" onIonRefresh={doRefresh} pullMin={50} pullMax={200}>
      <IonRefresherContent
        pullingIcon={chevronDownCircleOutline}
        refreshingSpinner="circles">
      </IonRefresherContent>
    </IonRefresher>        
    <IonList>    
      {reqs && reqs.map(req => { // loop through requests_list and make notification for each request
        console.log(reqs)
        console.log(req)
        return(<Request id={req} key={reqs.indexOf(req)} />)          
      })} 
    </IonList>
    </IonContent>
  )
}


const Memories: React.FC = () => {
  return(
    <IonPage>
      <MemoryList />
        {/* to allow for last item in list to be clicked (otherwise it's covered by tabbar) */}
        <br/> <br/> <br/> <br/> <br/> <br/>
    </IonPage>
  )
}
const Home: React.FC = () => {

  return(
    <IonPage>
      <IonToolbar>
        <IonButtons slot="start">
          <IonButton class="top-icons" href='/users'>
            <IonIcon slot="icon-only" icon={personAddSharp} />
          </IonButton>       
        </IonButtons>
        <IonTitle>Upcoming <br/> parties</IonTitle>
        <IonButtons slot="end">   
          <IonButton class="top-icons" href= '/people'>
            <IonIcon slot="icon-only" src="assets/icon/People.svg"/> 
          </IonButton>         
        </IonButtons>                        
      </IonToolbar>
      <FriendRequests/>
      <PartyList/>
      <br/> <br/> <br/> <br/> <br/> <br/>
    </IonPage>
  )
}
const SignedInRoutes: React.FC = () => {
  return(
    <IonReactRouter>  
      <IonTabs>
        <IonRouterOutlet>       
          <Route path='/signin' component={SignIn} />
          <Route path='/create' component={Create} />
          <Route path='/users' component={Users} />
          <Route path='/people' component={Profile} />
          <Route path='/gallery' component={Gallery} />
          <Route path='/memories' component={Memories} />
          <Route path='/home' component={Home} exact />      
          <Route exact path={["/signin", "/"]} render={() => <Redirect to="/home" />} />
        </IonRouterOutlet> 
        
        <IonTabBar slot="bottom">
          <IonTabButton tab="home" href="/home">
            <IonIcon class="side-icons" icon={home} />
            <IonLabel>Home</IonLabel>
            <IonRippleEffect></IonRippleEffect>
          </IonTabButton>
          <IonTabButton tab="create" href="/create">
            <IonIcon class="mid-icon" src="assets/icon/Create.svg" />
            <IonLabel>Create</IonLabel>
            <IonRippleEffect></IonRippleEffect>
          </IonTabButton>              
          <IonTabButton tab="memories" href="/memories">
            <IonIcon class="side-icons" src="assets/icon/Memories.svg" />
            <IonLabel>Memories</IonLabel>
            <IonRippleEffect></IonRippleEffect>
          </IonTabButton>                         
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>  
  )
}
const App: React.FC =() => {
  // Triggers when the auth state change for instance when the user signs-in or signs-out.
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false)
  useEffect(() => {
    firebase.auth().onAuthStateChanged(function(user) {
      var user = firebase.auth().currentUser;
        if (user != null) {
          //logged in 
          setSignedIn(true)
        } else {  
          setSignedIn(false)     
        }
        setLoading(false)
    })
  })
  if (loading) {
    return(
      <IonApp>
        <IonLoading 
        cssClass="loading"
        spinner="bubbles"
        isOpen={loading} 
        onDidDismiss={() => setLoading(false)} />  
      </IonApp> 
    )
  } else {
    return( 
    <IonApp>
        { signedIn ? (
          <SignedInRoutes />
        ) : (     
          <IonReactRouter>
            <IonRouterOutlet>
              <Route path='/signin' component={SignIn} />
              <Route exact path="/" render={() => <Redirect to="/signin" />} />
            </IonRouterOutlet>    
          </IonReactRouter>         
        )}
    </IonApp>
  )
  }
};

export default App;