import React, { useState, useEffect} from 'react';
import Users from './components/users';
import CreateParty from './components/createparty';
import MapContainer from './components/mapcontainer';
import Gallery from './components/gallery';
import Memory from './components/memory';
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion';
import { Route, Redirect } from 'react-router-dom';
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

  const [parties, setParties] = useState([]);  
  const [id, setID] = useState<string>('');
  const [inGallery, setInGallery] = useState(false);

  useEffect(() => {  
    // useeffect hook only runs after first render so it only runs once
    displayParties();
    // this means display parties only runs once
  },
  []);  

  // if memory card clicked, go to gallery
  const enter = (id) => {
    setInGallery(true)
    setID(id)
  }  

  const today = new Date();
  const yourparties = [];
  const otherparties = [];


  const displayParties = () => {
    // get current user 
    var current_user = firebase.auth().currentUser.uid;
    // get the document of the current user from firestore users collection
    firebase.firestore().collection("users").doc(current_user).get().then(function(doc) {      
      var i; // define counter for the for loop   
      // loop through all parties in the user's document as long as there are parties there
      if (doc.data().myParties.length > 0) {
        for (i = 0; i < doc.data().myParties.length; i++) {     
          // get party of the curr_id from the user's document
          let current_id = doc.data().myParties[i]
          firebase.firestore().collection("parties").doc(current_id).get().then(function(doc) {
            // setState to contian all the party documents from the user's document
            setParties(parties => [
              ...parties,
              {
                id: current_id,
                doc: doc,
              }
            ]);
          })
        }
      }
    })        
  }

  parties && parties.map(party_id => {
    let data = party_id.doc.data();
    // if the party has happened display on memories - if host is current user, diaply in hosted parties 
    if (moment(data.endTime).isBefore(today) && data.host === firebase.auth().currentUser.displayName) {           
      yourparties.push(party_id.doc)       
    } else if (moment(data.endTime).isBefore(today)) {
      otherparties.push(party_id.doc)
    }    
  });

  if (inGallery) {
    return(
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
  } else {
    return(
      <>
        <IonToolbar>
          <IonTitle>Memories</IonTitle>
        </IonToolbar>
        <IonContent fullscreen={true}>
        <IonText class="ion-padding-start">Your parties</IonText>
        {yourparties.length === 0 ?
        <IonText class="ion-padding-start"> <br/> <br/> No hosted parties yet..</IonText> :
        yourparties.map(doc => {
          return(<Memory doc={doc} key={doc.id} click={() => enter(doc.id)}/>)          
        })}
        <IonText class="ion-padding-start">Parties attended</IonText>
        {otherparties.length === 0 ?
        <IonText class="white-text"> <br/> <br/> nothing here yet.. </IonText> : 
        otherparties.map(doc => {
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
  let data = doc.data();

  const today = new Date();  
  // if the party is now, display in live parties with camera function
  if (moment(today).isBefore(data.dateTime, data.endTime)) {
    setIsLive(false);
  }
  
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
  },
  []);  

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
        var curr_id = doc.data().request_from[i]
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
      console.log(doc.data().myParties);  
      var i; // define counter for the for loop   
      // loop through all parties in the user's document as long as there are parties there
      if (doc.data().myParties) {
        for (i = 0; i < doc.data().myParties.length; i++) {              
          var curr_id = doc.data().myParties[i];  
          // get party of the curr_id from the user's document
          firebase.firestore().collection("parties").doc(curr_id).get().then(function(doc) {
            // setState to contian all the party documents from the user's document
            setParties(parties => [
              ...parties,
              {
                id: curr_id,
                doc: doc,
              }
            ]);
          })
        }
      }
    })        
  }


  return(
    //refreshing bit first. This just handles the requests once they have been made.
    <IonContent fullscreen={true}>
      <IonRefresher slot="fixed" onIonRefresh={doRefresh} pullMin={50} pullMax={200}>
      <IonRefresherContent
        pullingIcon={chevronDownCircleOutline}
        refreshingSpinner="circles">
      </IonRefresherContent>
    </IonRefresher>
    {reqs && reqs.map(req => 
        (<Request id={req.name} key={req.id}/>)
    )}
      <Accordion allowZeroExpanded={true} allowMultipleExpanded={true}>   
      {parties && parties.map(party_id => {
          const today = new Date();  
          let data = party_id.doc.data();
          // if the party is now, display in live parties with camera function
          if (moment(today).isBetween(data.dateTime, data.endTime)) {
            return(          
                <>
                <IonTitle color="danger">LIVE!</IonTitle>              
                <Party doc={party_id.doc} key={data.id + "live"} live={true} classname="live-item"/>              
                <br/>
                </>
              );                    
          } // if party is after today display it on the home page 
          if (moment(data.dateTime).isAfter(today)) {
            return( 
              <>
              <Party key={data.id} doc={party_id.doc} live={false} classname="accordion-item"/>
              </>
            );                
          }        
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

  // change this to appear in users.
  //if accept is clicked, inside friends collection, create doc with current user's id and add that friend's id
  //to array. If that works, inside friends collection inside the friend's document, add the current user's id.
  // If this is successful then remove eachother from requests.
  const acceptFriend = (friendsID) => {
    
    const collectionRef = firebase.firestore().collection("friends"); 
    //const [Friends, setFriends] = useState([]); 
    
    //var currentState = "not_friends"
    //var disabledState = false
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
            //setAddDisabled(true); //disables add friend button
            //setCancelDisabled(false); //enalbes cancel request button
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
    <IonItem>
      <IonText>{name} wants to be friends</IonText>
      <IonButton onClick={() => acceptFriend(id)}>Accept</IonButton>
    </IonItem>
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
          <Route path='/people' component={Profile} />
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