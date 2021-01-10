import React, { useState, useEffect } from 'react';
import Users from './components/users';
import CreateParty from './components/createparty';
import MapContainer from './components/mapcontainer';
import Gallery from './components/gallery';
import MemoryList from './components/memories';
import SignIn from './components/signin';
import Profile from './components/profile';
import OtherProfile from './components/otherprofile';

import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion';
import { Route, Redirect, RouteComponentProps } from 'react-router-dom';
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
  IonButton,
  IonPage,
  IonContent, 
  IonToolbar, 
  IonButtons, 
  IonTitle,
  IonRow,
  IonCol,
  IonGrid,
  IonPopover,
  IonImg,
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
import {useCamera} from '@ionic/react-hooks/camera';
import {CameraResultType, CameraSource, Plugins} from '@capacitor/core';
import './App.css';
import firebase from './firestore';
import moment from 'moment';
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
// once finished, run ionic build then npx cap add ios and npx cap add android

//TODO - 
// delete party document in firebase after it's happened

const Party = ({doc, live, classname}) => {
  // party card

  const [showToast, setShowToast] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [photo, setPhoto] = useState('');
  //const {photo, getPhoto} = useCamera(); 
  const { Camera } = Plugins;
  const [isLive, setIsLive] = useState(live);
 
  const onSave = async() => { 
    if (photo !== "") {
    await collectionRef.doc(doc.id).collection('pictures').add({
        picture: photo,
        takenBy: firebase.auth().currentUser.displayName,
        takenAt: moment(new Date()).format('LT'),
        likeCounter: 0,
        likes: [],
    })
      .then(function() {
        setShowToast(true)
      })
      .catch(function(error) {
        console.log(error)
      });
      setPhoto('');
    }
  }  

  // TODO - add IOS AND ANDROID permissions from pwa elements
  const takePhoto = async() => {
    const cameraPhoto = await Camera.getPhoto({
      allowEditing: true,      
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      quality: 100
    });
    var photo = `data:image/jpeg;base64,${cameraPhoto.base64String}`
    setPhoto(photo);  
  }    

  const collectionRef = firebase.firestore().collection("parties");
  let data = doc.data();

  const today = new Date();  
  // if the party is now, display in live parties with camera function
  if (moment(today).isBefore(data.dateTime, data.endTime)) {
    setIsLive(false);
  }
  
  let liveParty // not live initially
  if (isLive) {
    liveParty =   
    <IonRow> 
      <IonButton class="custom-button" expand="block" onClick={photo ? onSave : takePhoto}>
        <IonIcon icon={photo ? cloudUploadSharp : cameraSharp} />        
      </IonButton>  
    </IonRow>
  } else {};

  return(
    <IonItem className={classname}>
      <IonGrid>
        <IonRow>
          <IonCol size="2.5" class="date-box">
            <IonText>{data.month} <br/></IonText>   
            <IonText class="day-text">{data.day}</IonText> 
          </IonCol>
          <IonCol size="5.5">            
            <IonText>{data.title} <br/></IonText>  
            <IonText class="white-text">{data.address}</IonText><br/>
            <IonText class="white-text">{data.postcode}</IonText><br/>
            <IonText class="white-text">By {data.host}</IonText>
          </IonCol>      
          <IonCol size="4">
            <IonButton class="custom-button" onClick={()=> setShowPopover(true)}>
              See <br/> details
            </IonButton>
          </IonCol>
        </IonRow> 
        <IonRow>
          {photo ? 
          <IonButton onClick={() => setPhoto('')}>
            Cancel
          </IonButton> :
          null}
        </IonRow>  
        <IonRow> 
          {photo ? <IonImg src={photo}></IonImg> : null}
        </IonRow>          
        {/*if live then display camera buttons */}   
        {liveParty}        
      </IonGrid>   
      <IonPopover
        cssClass="popover"        
        isOpen={showPopover}
        onDidDismiss={() => setShowPopover(false)}
      >
        <IonItem>Address: {data.address} </IonItem>  
        <IonItem>Postcode: {data.postcode} </IonItem>     
        <IonItem>Starts: {moment(data.dateTime).format('LT')}</IonItem>     
        <IonItem>Ends: {moment(data.endTime).format('LT')}</IonItem>
        <IonItem>Pending invites: 10291</IonItem>
        <IonItem>Accepted Invites: 138430</IonItem>
        <IonLabel className="ion-padding" color="warning">Details:</IonLabel>
        <IonItem>{data.details}</IonItem>              
      </IonPopover>    
      <IonToast 
      isOpen={showToast}
      onDidDismiss={() => setShowToast(false)}
      duration={2000}
      message="Picture uploaded!"
      position="bottom"
      />       
    </IonItem>
  )
}

// when party is created and invites are sent, each user invited gets the party id added to their document.
// Each user then checks their document for parties and then if there is a new party id, this is then checked
// against the same id in the parties collection in order to display all the details.
const PartyList = () => {

  // for friend request bit.
  const collectionRef = firebase.firestore().collection("friend_requests"); 
  const [reqs, setReqs] = useState([]); 
  const [parties, setParties] = useState([]);

  useEffect(() => {  
    // useeffect hook only runs after first render so it only runs once
    displayParties();
    // this means display parties only runs once
  },  []);  

  // todo - make this so it doesn't depend on user manually refreshing 
  //This just handles the requests once they have been made.
  //On refresh check current user's 'request from' array inside friend requests and display their profile. Then see
  // accept friend.
  function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    //get current user
    var current_user = firebase.auth().currentUser.uid;    
    setReqs([]);
    //Inside friend_requests, inside current user's doc. HERE
    collectionRef.doc(current_user).get().then(function(doc) {          
      console.log("req - Document data:", doc.data().request_from);
      
      var i; // define counter for the for loop     
      for (i = 0; i < doc.data().request_from.length; i++) {
        var curr_id = doc.data().request_from && doc.data().request_from[i]
        // set curr_id to the current id in the request_from list
        console.log(i, curr_id)
        // if the current id (i.e. request from) is already in the state, don't do anything        
          // otherwise, add it to the state   
          setReqs(reqs => [
            ...reqs, 
            {
              id: curr_id, 
              name: curr_id
            }
          ]);              
          console.log(reqs)
        // Remove ID from the document
        // var removeID = collectionRef.doc(current_user).update({
        //     request_from: firebase.firestore.FieldValue.arrayRemove(curr_id)
        // });        
      };
      console.log(reqs)
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });

    setTimeout(() => {
      event.detail.complete();
    }, 2000);
  }   

  const displayParties = () => {
    // get current user 
    var current_user = firebase.auth().currentUser.uid;   
    // get the document of the current user from firestore users collection
    firebase.firestore().collection("users").doc(current_user).get().then(function(doc) {      
      var i; // define counter for the for loop   
      // loop through all parties in the user's document as long as there are parties there
      // loop through until state (parties) has same number of parties as myParties array
      if (doc.data().myParties && doc.data().myParties.length > 0) {
        for (i = 0; i < doc.data().myParties.length; i++) {     
          // get party of the curr_id from the user's document
          let curr_id = doc.data().myParties && doc.data().myParties[i];
          firebase.firestore().collection("parties").doc(curr_id).get().then(function(doc) {
            // setState to contian all the party documents from the user's document 
              setParties(parties => [
                ...parties,
                {
                  id: doc.id,
                  doc: doc
                }
              ]);                       
          })
        }             
      }
    })           
  }

  const today = new Date();
  const upcomingParties = [];
  const liveParties = [];

  parties && parties.map(party => {
    let data = party.doc.data();
    // if the party has happened display on memories - if host is current user, diaply in hosted parties 
    if (moment(data.dateTime).isAfter(today)) {           
      upcomingParties.push(party.doc)       
    } else if (moment(today).isBetween(data.dateTime, data.endTime)) {
      liveParties.push(party.doc);
      var index = upcomingParties.indexOf(party.doc);
      if (index) {
        upcomingParties.splice(index, 1)
      }
    }
  });  

  var numPastParties = 0; // count for number of parties that happened in the past

  return(
    //refreshing bit first. This just handles the requests once they have been made.
    <IonContent fullscreen={true} no-bounce>
      <IonRefresher slot="fixed" onIonRefresh={doRefresh} pullMin={50} pullMax={200}>
        <IonRefresherContent
          pullingIcon={chevronDownCircleOutline}
          refreshingSpinner="circles">
        </IonRefresherContent>
      </IonRefresher> 
      {reqs && reqs.map(req => 
          (<Request id={req.name} key={req.id}/>)
      )}
      { upcomingParties.length > 0 ? null :
        liveParties.length > 0 ? null :
        <IonText class="ion-padding-start">No upcoming parties...</IonText>
      }}      
      <Accordion allowZeroExpanded={true} allowMultipleExpanded={true}>   
      {liveParties && liveParties.map(party => { 
        return(        
          <>
          <IonTitle color="danger">LIVE!</IonTitle>              
          <Party doc={party} key={party.id + "live"} live={true} classname="live-item"/>              
          <br/>
          </>
        );                    
      })}
       {upcomingParties && upcomingParties.map(party => {
          return( 
            <>
            <Party key={party.id} doc={party} live={false} classname="accordion-item"/>
            </>
          );                
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

  // todo - change this to appear in users.
  //if accept is clicked, inside friends collection, create doc with current user's id and add that friend's id
  //to array. If that works, inside friends collection inside the friend's document, add the current user's id.
  // If this is successful then remove eachother from requests.
  const acceptFriend = (friendsID) => {
    
    const collectionRef = firebase.firestore().collection("friends"); 

    var friend_user_id = friendsID
    var current_user_id = firebase.auth().currentUser.uid
    //console.log(receiver_user_id)

    //create doc with users's id if it doesn't already exist and adds friend's id to field.
    collectionRef.doc(current_user_id).get()
      .then((docSnapshot) => {
        //if the doc exists...
        if (docSnapshot.exists) {
          collectionRef.doc(current_user_id).onSnapshot((doc) => {
            collectionRef.doc(current_user_id).update({
              //...add friend's UID to array inside current users doc
              friends: firebase.firestore.FieldValue.arrayUnion(friend_user_id)
            })      
          });
        } else {
          // if array doesn't exist, create the array
          collectionRef.doc(current_user_id).set({id: current_user_id, friends: [friend_user_id]}) // create the document
        }
    })
        //console.log("Document written with ID: ", docRef.id);
        //if successful, create doc w friend's id and add current user's id to the other person's friends array
      .then(function(docRef) {
      collectionRef.doc(friend_user_id).get()
        .then((docSnapshot) => {
          if (docSnapshot.exists) {
            collectionRef.doc(friend_user_id).onSnapshot((doc) => {
              collectionRef.doc(friend_user_id).update({
                friends: firebase.firestore.FieldValue.arrayUnion(current_user_id)
              })      
            });
          } else {
            collectionRef.doc(friend_user_id).set({id: friend_user_id, friends: [current_user_id]}) // create the document
          }
      })        
          //if successful
          .then(function(docRef) {
            //HERE IS WHERE YOU SHOULD REMOVE REQUEST from friends_requests collection
            firebase.firestore().collection("friend_requests").doc(friend_user_id).update({
              request_to: firebase.firestore.FieldValue.arrayRemove(current_user_id)
            })
                // if requests_to item is removed successfully... then remove item from request_from array
                .then(function(docRef) {
                firebase.firestore().collection("friend_requests").doc(current_user_id).update({
                  request_from: firebase.firestore.FieldValue.arrayRemove(friend_user_id)                
                  //removes text display 

                });            
                }).catch(function(error) {
                console.error("Error deleting id from requests_from: ", error);
                }); 
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

  }

  return(
    <IonItem button>
      <IonText>{name} wants to be friends</IonText>
      <IonButton onClick={() => acceptFriend(id)}>Accept</IonButton>
    </IonItem>
  )
}

const Memories: React.FC = () => {

  return(
    <IonPage>
      <MemoryList memoriesPage={true}/>
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
          <IonButton class="top-icons" href='/profile'>
            <IonIcon slot="icon-only" src="assets/icon/People.svg"/> 
          </IonButton>         
        </IonButtons>                        
      </IonToolbar>
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
          <Route path='/googlemap' component={MapContainer} />   
          <Route path='/signin' component={SignIn} />
          <Route path='/create' component={Create} />
          <Route path='/users' component={Users} />
          <Route path='/profile' render={props => <Profile {...props}/>} />   
          <Route exact path="/profile" render={() => <Redirect to='/profile' />} />                 
          <Route path='/gallery' component={Gallery} />
          <Route path='/memories' component={Memories} />
          <Route path='/home' component={Home} exact />      
          <Route exact path={["/signin", "/"]} render={() => <Redirect to="/home" />} />
        </IonRouterOutlet> 
        
        <IonTabBar slot="bottom" id="appTabBar">
          <IonTabButton tab="home" href="/home">
            <IonIcon class="side-icons" icon={home} />
            Home
            <IonRippleEffect></IonRippleEffect>
          </IonTabButton>
          <IonTabButton tab="create" href="/create">
            <IonIcon class="mid-icon" src="assets/icon/Create.svg" />
            Create
            <IonRippleEffect></IonRippleEffect>
          </IonTabButton>              
          <IonTabButton tab="memories" href="/memories">
            <IonIcon class="side-icons" src="assets/icon/Memories.svg" />
            Memories
            <IonRippleEffect></IonRippleEffect>
          </IonTabButton>                         
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>  
  )
}

const App: React.FC = () => {
  // Triggers when the auth state change for instance when the user signs-in or signs-out.
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    console.log("app useeffect")
    firebase.auth().onAuthStateChanged(function(user) {
      if (user && user.emailVerified) { // if new user logs in and is email verified 
        setSignedIn(true);  
      } 
      setLoading(false)
    })
  }, [])

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