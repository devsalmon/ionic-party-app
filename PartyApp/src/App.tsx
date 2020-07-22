import React, { useState, useEffect} from 'react';
import Users from './components/users';
import CreateParty from './components/createparty';
import Gallery from './components/gallery';
import Memory from './components/memory';
import People from './components/people';
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion';
import { Route, Redirect } from 'react-router-dom';
import {useDocument, useCollection} from 'react-firebase-hooks/firestore';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs, 
  IonItem,
  IonList, 
  IonButton,
  IonPage,
  IonHeader, 
  IonContent, 
  IonToolbar, 
  IonButtons, 
  IonMenuButton,
  IonTitle,
  IonSearchbar,
  IonRow,
  IonCol,
  IonInput,
  IonModal, 
  IonDatetime,
  IonCheckbox, 
  IonGrid,
  IonTextarea,
  IonItemGroup,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonMenu,
  IonMenuToggle,
  IonText,
  IonToast,
  IonCardSubtitle,
  IonFooter,
  IonAvatar,
  IonPopover,
  IonRippleEffect,
  IonLoading,
  IonAlert,
  IonImg,
  IonSlides,
  IonSlide,
  IonBackButton, 
  createAnimation
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { 
  home, 
  addCircle, 
  personAddSharp,  
  peopleCircleOutline, 
  arrowDownCircle, 
  arrowForwardCircle, 
  starSharp,  
  imageSharp,
  logOutSharp,
  notificationsSharp,
  personCircleSharp,
  cameraSharp,
  createSharp,
  chatbubblesSharp,
  trashBinSharp,
  cloudUploadSharp,  
  chevronBackSharp
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
      firebase.firestore().collection('users').add({
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
        <IonContent className="ion-text-center">
          <IonItem>
              <IonLabel>Email</IonLabel>
              <IonInput value={email} placeholder="username"></IonInput>
          </IonItem>  
          <IonItem>
              <IonLabel>Password</IonLabel>
              <IonInput value={password} placeholder="password"></IonInput>
          </IonItem>  
          <IonButton onClick={() => SignInGooglepu()}>Login</IonButton>
        </IonContent>
    </IonPage>
  )
}
class Page {
  title: string = '';
  url: string = '';
  icon: string = '';
};
const appPages: Page[] = [
  {title: 'Users', url: '/users', icon: "./customIcons/People.svg"},  
]
const Links = () => {
  return(
    <IonList>
      {appPages.map((appPage, index) => {
      return (
        <IonMenuToggle key={index} auto-hide="false">
          <IonItem href={appPage.url}>
              <IonIcon color="dark" slot="start" icon={appPage.icon} />
              <IonLabel color="dark">{appPage.title}</IonLabel>
          </IonItem>
        </IonMenuToggle>
      );
      })}
    </IonList>
)
};
class Menu extends React.Component{
  render() {
    return(
      <div>
      <IonMenuToggle>
        <IonMenu type="overlay" contentId="main" menuId="main-menu">
          <IonHeader>
            <IonToolbar>
              <IonTitle size="large">Menu</IonTitle>              
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <Links /> 
          </IonContent>
        </IonMenu>
      </IonMenuToggle>
      <IonRouterOutlet id="main">
      </IonRouterOutlet>
      </div>
    );
  }  
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

  const today = moment(new Date()).format('LLL');
  if (inGallery) {
    return(
      !loading && (
        <Gallery id={id} key={id} click={() => setInGallery(false)}/>
      )
    )
  } else {
    return(
      <Accordion allowZeroExpanded={true} allowMultipleExpanded={true}>
        {value && value.docs.map(doc => {
          // if the party has happened display on memories 
          if (moment(doc.data().date).isBefore(today)) {
            return(
              !loading && (
                <Memory doc={doc} key={doc.id} click={() => enter(doc.id)}/>
              )
            )   
          } else {}
        })}
      </Accordion>
    )
  }
}
const Chat = () => {
  // party card
  const db = firebase.firestore().collection("parties");
  return(
    <IonPage>
      <IonToolbar>
        <IonTitle>Party Chat</IonTitle>
      </IonToolbar>
      <IonContent>      
      </IonContent>
    </IonPage>
  )
} 
const Party = ({doc}) => {
  // party card
  const [showPopover, setShowPopover] = useState(false);

  let data = doc.data()
  return(
    <>
    <AccordionItem className="accordion-item">
      <AccordionItemHeading>
          <AccordionItemButton className="ion-padding">
            <IonRow>
              <IonCol size="2.5" class="date-box">
                <IonText>{data.month} <br/></IonText>   
                <IonText class="day-text">{data.day}</IonText> 
              </IonCol>
              <IonCol>            
                <IonText>{data.title} <br/></IonText>  
                <IonText class="white-text">{data.location} <br/></IonText>
                <IonText class="white-text">Created {data.createdOn}</IonText>
              </IonCol>         
            </IonRow>       
          </AccordionItemButton>
      </AccordionItemHeading>
      <AccordionItemPanel>        
        <IonRow>
          <IonCol>
            <IonButton class="custom-button" expand="block" onClick={() => setShowPopover(true)}>
              Info
            </IonButton>
          </IonCol>
          <IonCol>             
            <IonButton class="custom-button" expand="block" href='/chat'>
              <IonIcon icon={chatbubblesSharp} />
            </IonButton>
          </IonCol>  
        </IonRow>
      </AccordionItemPanel>
    </AccordionItem>
    <IonPopover
      isOpen={showPopover}
      cssClass='popover'
      onDidDismiss={e => setShowPopover(false)}
    >
      <IonLabel class="popover-label">Details:</IonLabel>
      <IonItem class="popover-item">{data.details}</IonItem>
      <IonLabel class="popover-label">Location:</IonLabel>
      <IonItem class="popover-item">{data.location}</IonItem>
      <IonLabel class="popover-label">Starts:</IonLabel>          
      <IonItem class="popover-item">{data.startTime}</IonItem>
      <IonLabel class="popover-label">Ends:</IonLabel>
      <IonItem class="popover-item">{data.endTime}</IonItem>
    </IonPopover> 
    </>
  )
}
const PartyList = () => {
  const [value, loading, error] = useCollection(
    firebase.firestore().collection("parties").orderBy("date", "desc"), //order by parties closest to today's date 
  );
  const today = moment(new Date()).format('LLL')
  return(
    <Accordion allowZeroExpanded={true} allowMultipleExpanded={true}>
      {value && value.docs.map(doc => {
        // if the party has happened don't display
        if (moment(doc.data().date).isAfter(today)) {
          return(
            !loading && (
              <Party doc={doc} key={doc.id} />
            )
          )      
        } else {}
      })}
    </Accordion>
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




const FriendRequests = () => {

  const collectionRef = firebase.firestore().collection("friend_requests");

  const acceptFriend = (objectID) => {
    var sender_user_id = firebase.auth().currentUser.uid
    var receiver_user_id = objectID
    
    var date = moment(new Date()).format('LLL')

    //create doc with sender's id and adds receiver's id to collection.
    collectionRef.doc(sender_user_id).collection(receiver_user_id).add(
      {date: date})

      //if successful
      .then(function(docRef) {
        //console.log("Document written with ID: ", docRef.id);
        //if successful, create doc w receiver's id and add sender's id to collection
        collectionRef.doc(receiver_user_id).collection(sender_user_id).add(

          {date: date})
          
          //if successful
          .then(function(docRef) {
            //currentState = "request_received"
            //setaddBtnDisabled(true); //disables add friend button
            //setcancBtnDisabled(false); //enalbes cancel request button
          })

          //if unsuccessful
          .catch(function(error) {
            console.error("Error adding document: ", error);
        }); 
      })

    //if unsuccessful
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });

  collectionRef.doc(firebase.auth().currentUser.uid).collection('0gOOtbVUGwYrMAyoOQCCXDjXJax2')
  .onSnapshot(function(doc) {
    doc.docChanges().forEach(function(change) {
      if (change.doc.data().request_status = "received") {
        // if on receiver's account, return list of friend requests
        let userRef = firebase.firestore().collection("users").doc('DMhdq4BpaksyJtfnbhBe');
        // get document of user who sent the request 
        console.log("Current data: ", change.doc.data());

        userRef.get().then(function(doc) {
          return (
            <IonItem key={doc.id}>
              <IonText>{doc.data().name} wants to be friends</IonText>
              <IonButton slot="end" onClick={() => acceptFriend(doc.id)}>
                Accept
              </IonButton>
            </IonItem>
          )  
        })              
      }
    })
  });   
  }    

  return(null
  )
}


const Memories: React.FC = () => {
  return(
    <IonPage>
      <IonToolbar>
        <IonTitle>Memories</IonTitle>
      </IonToolbar>
      <IonContent>
        <MemoryList />
          {/* to allow for last item in list to be clicked (otherwise it's covered by tabbar) */}
          <br/> <br/> <br/> <br/> <br/> <br/>
      </IonContent>
    </IonPage>
  )
}
const Home: React.FC = () => {
  return(
    <IonPage>
      <IonToolbar>
        <IonButtons slot="start">
          <IonMenuButton class="top-icons" autoHide={false} menu="main-menu"></IonMenuButton>        
        </IonButtons>  
        <IonButtons slot="end">   
          <IonButton class="top-icons" href= '/people'>
            <IonIcon slot="icon-only" src="assets/icon/People.svg"/> 
          </IonButton>         
        </IonButtons>                
        <IonTitle>Upcoming <br/> parties</IonTitle>
      </IonToolbar>
      <IonContent>     
        <PartyList />     
        <br/> <br/> <br/> <br/> <br/> <br/>
      </IonContent>
    </IonPage>
  )
}
const SignedInRoutes: React.FC = () => {
  return(
    <>
    <Menu /> 
      <IonReactRouter>
          <IonRouterOutlet>       
            <Route path='/signin' component={SignIn} />
            <Route path='/create' component={Create} />
            <Route path='/users' component={Users} />
            <Route path='/people' component={People} />
            <Route path='/chat' component={Chat} />
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
      </IonReactRouter>   
    </> 
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