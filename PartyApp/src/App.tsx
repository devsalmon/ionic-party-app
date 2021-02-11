import React, { useState, useEffect, useRef } from 'react';
import Users from './components/users';
import CreateParty from './components/createparty';
import MapContainer from './components/mapcontainer';
import Gallery from './components/gallery';
import MyPartyList from './components/myparties';
import SignIn from './components/signin';
import OtherProfile from './components/otherprofile';

import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion';
import { Route, Redirect, RouteComponentProps, useLocation, useHistory } from 'react-router-dom';
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
  IonSlides,
  IonSlide,
  IonRadio,
  IonRadioGroup,
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
  IonRange,
  IonToast,
  IonRippleEffect,
  IonLoading,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { 
  home, 
  personAddSharp,   
  cameraOutline,
  chevronDownCircleOutline,
  cloudUploadOutline,
  chevronBackSharp,  
  thumbsUpOutline,
  thumbsDownOutline,
  manOutline,
  womanOutline,
  createOutline
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

const Party = ({id, data, live, edit}) => {
  // party card

  useEffect(()=>{
    getDaysUntilParty()
  })

  const [showToast, setShowToast] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [photo, setPhoto] = useState('');
  const [daysUntilParty, setDaysUntilParty] = useState(0);
  const [hoursUntilParty, setHoursUntilParty] = useState(0);
  const [minutesUntilParty, setMinutesUntilParty] = useState(0);
  //const {photo, getPhoto} = useCamera(); 
  const { Camera } = Plugins;
  const [isLive, setIsLive] = useState(live);
  const collectionRef = firebase.firestore().collection("users").doc(data.hostid).collection("myParties");  

  const onSave = async() => { 
    if (photo !== "") {
    await collectionRef.doc(id).collection('pictures').add({
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
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt,
      quality: 100,
      saveToGallery: true
    });
    var photo = `data:image/jpeg;base64,${cameraPhoto.base64String}`;
    setPhoto(photo);  
  }    

  const getDaysUntilParty = () => {    
    var now = new Date().getTime();
    var countdownTime = moment(data.dateTime).valueOf();
    var days = Math.floor((countdownTime - now) / (1000 * 60 * 60 * 24));
    var hours = Math.floor(((countdownTime - now) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor(((countdownTime - now) % (1000 * 60 * 60)) / (1000 * 60));
    if (days === 0 && hours !== 0) { // if less than a day left until party
      setHoursUntilParty(hours);
      setMinutesUntilParty(minutes);
    } else if (hours === 0) {
      setMinutesUntilParty(minutes)
    } else {
      setDaysUntilParty(days);
    }    
  }

  var today = new Date();
  return(
    <>
    {moment(today).isBetween(moment(data.endTime), moment(data.endTime).add(1, 'days')) ? 
    <><IonCardTitle color="warning">After Party</IonCardTitle><br/></> :
    isLive ? <><IonCardTitle color="danger">Live!</IonCardTitle><br/></> : 
    <div className="ion-text-center">
      {hoursUntilParty ? 
      <IonText className="ion-padding">
        {hoursUntilParty}hrs {minutesUntilParty}mins
      </IonText> : 
      minutesUntilParty ? 
      <IonText className="ion-padding">
        {minutesUntilParty}mins
      </IonText> :       
      <IonText className="ion-padding"> 
        {daysUntilParty}days
      </IonText>
      }<br/>
    </div>}
    <IonItem className="accordion-item" lines="none">
      <IonGrid>
        <IonRow>
          <IonCol size="2.5" class={live ? "red-date-box" : "yellow-date-box"}>
            <IonText>{data.month} <br/></IonText>   
            <IonText class="day-text">{data.day}</IonText> 
          </IonCol>
          <IonCol>            
            <IonText>{data.title} <br/></IonText>  
            <IonText class="white-text">{data.address}</IonText><br/>
            <IonText class="white-text">{data.postcode}</IonText><br/>
            <IonText class="white-text">By {data.host}</IonText>
          </IonCol>      
        </IonRow> 
        <IonRow className="ion-text-center">
          <IonCol className="ion-align-self-center">
            {firebase.auth().currentUser.displayName === data.host ?              
              <IonButton color="warning" onClick={edit}>
                <IonIcon slot="icon-only" icon={createOutline} />
              </IonButton>
             : null
            }      
            </IonCol>
          <IonCol className="ion-align-self-center">    
            <IonButton color="warning" onClick={()=> setShowPopover(true)}>
              <IonIcon slot="icon-only" src="assets/icon/balloon-outline.svg"/>
            </IonButton>
          </IonCol>
          {isLive ? 
          <IonCol className="ion-self-align-center"> 
            <IonButton color="warning" onClick={takePhoto}>
              <IonIcon slot="icon-only" icon={cameraOutline} />      
            </IonButton>  
          </IonCol>           
          : null}
        </IonRow> 
        {photo ?
        <>         
        <IonRow  className="ion-text-center"> 
          <IonImg src={photo}></IonImg>
        </IonRow>     
        <IonRow  className="ion-text-center">
          <IonCol>
          <IonButton color="warning" onClick={onSave}>
            Share      
          </IonButton>
          </IonCol>
          <IonCol className="ion-align-self-center">
          <IonButton color="warning" onClick={() => setPhoto('')}>
            Cancel
          </IonButton> 
          </IonCol>           
        </IonRow></> : null}                             
      </IonGrid>   
      <IonPopover
        cssClass="party-details-popover"        
        isOpen={showPopover}
        onDidDismiss={() => setShowPopover(false)}
      >
        <IonItem lines="none">Address: {data.address} </IonItem>  
        <IonItem lines="none">Postcode: {data.postcode} </IonItem>     
        <IonItem lines="none">Dress Code: {data.dresscode} </IonItem>             
        <IonItem lines="none">Drinks Provided: {data.drinksProvided} </IonItem> 
        <IonItem lines="none">
        Male:Female Ratio<br/>
        </IonItem>
        <IonItem lines="none">          
          <IonRange color="yellow" value={data.malesToFemales} disabled={true}>
            <IonIcon slot="start" icon={manOutline} />
            <IonIcon slot="end" icon={womanOutline} />
          </IonRange>       
        </IonItem> 
        <IonItem lines="none">Starts: {moment(data.dateTime).format('LT')}</IonItem>     
        <IonItem lines="none">Ends: {moment(data.endTime).format('LT')}</IonItem>
        {data.invited_people ? <IonItem lines="none">Number of Invites: {data.invited_people.length}</IonItem>  : null}
        {data.details ? 
        <>
        <IonItem lines="none">Details: {data.details}</IonItem>
        </>: null              
        } 
      </IonPopover>    
      <IonToast 
      isOpen={showToast}
      onDidDismiss={() => setShowToast(false)}
      duration={2000}
      message="Picture uploaded!"
      position="bottom"
      />       
    </IonItem>
    </>
  )
}

// when party is created and invites are sent, each user invited gets the party id added to their document.
// Each user then checks their document for parties and then if there is a new party id, this is then checked
// against the same id in the parties collection in order to display all the details.
const PartyList = ({editParty, stopEditing}) => {

  // for friend request bit.
  const collectionRef = firebase.firestore().collection("friend_requests"); 
  const [reqs, setReqs] = useState([]); 
  const [partyreqs, setPartyReqs] = useState([]);
  const [upcomingParties, setUpcomingParties] = useState([]);
  const [liveParties, setLiveParties] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [newNotifications, setNewNotifications] = useState(false);
  const [editingParty, setEditingParty] = useState(""); // holds data of the party being edited
  var current_user = firebase.auth().currentUser; 

  useEffect(() => {  
    // useeffect hook only runs after first render so it only runs once    
    displayParties()   
    upcomingParties.sort((a, b) => b.data.dateTime - a.data.dateTime);
    liveParties.sort((a, b) => b.data.dateTime - a.data.dateTime);
    // this means display parties only runs once
  },  [refresh]); 

  // Checks for friend requests
  collectionRef.doc(current_user.uid)
  .onSnapshot(function(doc) {
    if (doc.exists && doc.data().request_from) {
      for (var i = 0; i < doc.data().request_from.length; i++) {
        var curr_id = doc.data().request_from[i].id
        var alreadyInReq = reqs.some(item => curr_id === item.id);
        if (alreadyInReq) { 
          setNewNotifications(false)
        } else if (newNotifications == false){
          setNewNotifications(true);
        }
      }; 
    }
  });
 
  // Checks for party invites
 firebase.firestore().collection("users").doc(current_user.uid)
 .onSnapshot(function(doc) {
    if (doc.exists && doc.data().myInvites) {
      for (var j = 0; j < doc.data().myInvites.length; j++) {
        var curr_id = doc.data().myInvites[j].partyid
        var alreadyInInv = partyreqs.some(item => curr_id === item.partyid);
        if (alreadyInInv) { 
          setNewNotifications(false);
        } else if (newNotifications == false) {
          setNewNotifications(true);
        }
      };
    }
  });  

  //This just handles the requests once they have been made.
  //On refresh check current user's 'request from' array inside friend requests and display their profile. Then see
  // accept friend.
  function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    // toggle new parties so displayParties runs and it checks for new parties
    checkForRequests();
    setRefresh(!refresh);                
    setNewNotifications(false);
    setTimeout(() => {
      event.detail.complete();
    }, 2000);
  }   

  const checkForRequests = () => {  
      setReqs([])
      setPartyReqs([])
      collectionRef.doc(current_user.uid).get().then(function(doc) {
        if (doc.exists && doc.data().request_from) {          
          for (var i = 0; i < doc.data().request_from.length; i++) {
            var curr_id = doc.data().request_from[i].id
            setReqs(reqs => [
              ...reqs, 
              {
                id: curr_id, 
                name: curr_id
              }
            ]);            
          };
        }
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });
      firebase.firestore().collection("users").doc(current_user.uid).get().then(function(doc) {  
        if (doc.exists && doc.data().myInvites) {                  
          for (var j = 0; j < doc.data().myInvites.length; j++) {
            var hostid = doc.data().myInvites[j].hostid
            var partyid = doc.data().myInvites[j].partyid
            setPartyReqs(reqs => [
              ...reqs, 
              {
                hostid: hostid, 
                partyid: partyid
              }
            ]);                                          
          };
        }
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });
      setNewNotifications(false);
  }

  const displayParties = () => {          
    firebase.firestore().collection("users")
      .doc(current_user.uid).collection("myParties").orderBy("date", "asc").get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          let today = new Date();
          let data = doc.data();          
          var alreadyInUP = upcomingParties.some(item => doc.id === item.id);
          var alreadyInLP = liveParties.some(item => doc.id === item.id);
          var endTime = moment(data.endTime).add(1, 'days')
          if (moment(today).isBefore(data.dateTime) && !alreadyInUP) { 
            setUpcomingParties(parties => [
              ...parties, 
              {
                id: doc.id,
                data: data
              }              
            ]);
          } else if
          (moment(today).isBetween(data.dateTime, endTime)  && !alreadyInLP) {
            // if party is live
            setLiveParties(parties => [
              ...parties,
              {
                id: doc.id,
                data: data
              }
            ])
            // remove the party from upcomingParties array if party turns live
            for (var i=0; i < upcomingParties.length; i++) {
              if (upcomingParties[i].id === doc.id) {
                  upcomingParties.splice(i,1);
                  break;
              }   
            }             
          } else if (moment(today).isAfter(endTime)) {
            for (var i=0; i < liveParties.length; i++) {
              if (liveParties[i].id === doc.id) {
                  liveParties.splice(i,1);
                  break;
              }   
            }             
          }
        })
      })

    firebase.firestore().collection("users")
      .doc(current_user.uid).get().then(doc => {
          let today = new Date();
          let data = doc.data();
          if (data.acceptedInvites) {             
            for (var i=0; i < data.acceptedInvites.length; i++) {
              firebase.firestore().collection("users")
                .doc(data.acceptedInvites[i].hostid).collection("myParties").doc(data.acceptedInvites[i].partyid).get().then(partydoc => {
                  // if party is in the future and party isn't already in the state                   
                  var alreadyInUP = upcomingParties.some(item => partydoc.id === item.id);
                  var alreadyInLP = liveParties.some(item => partydoc.id === item.id);
                  var endTime = moment(partydoc.data().endTime).add(1, 'days')
                  if (moment(today).isBefore(partydoc.data().dateTime) && !alreadyInUP) { 
                    setUpcomingParties(parties => [
                      ...parties, 
                      {
                        id: partydoc.id,
                        data: partydoc.data()
                      }              
                    ]);
                  } else if 
                  (moment(today).isBetween(partydoc.data().dateTime, endTime) && !alreadyInLP) {
                    // if party is live
                    setLiveParties(parties => [
                      ...parties,
                      {
                        id: partydoc.id,
                        data: partydoc.data()
                      }
                    ]) 
                    // remove the party from upcomingParties array 
                    for (var i=0; i < upcomingParties.length; i++) {
                      if (upcomingParties[i].id === partydoc.id) {
                          upcomingParties.splice(i,1);
                          break;
                      }   
                    }             
                  } else if (moment(today).isAfter(endTime)) {
                      for (var i=0; i < liveParties.length; i++) {
                        if (liveParties[i].id === doc.id) {
                            liveParties.splice(i,1);
                            break;
                        }   
                      }             
                    }
              })
            } 
          }                 
    });      
  }

  const acceptInvite = () => {
    checkForRequests(); 
    displayParties();    
  }

  var history = useHistory();

  const location = useLocation();

  if (editingParty) {
    editParty();
    return(
      <CreateParty editingParty={editingParty} displayParties={() => setRefresh(!refresh)}/>
    )
  } else {
  stopEditing();
  return(    
    <IonContent fullscreen={true} no-bounce>
      <IonRefresher slot="fixed" onIonRefresh={doRefresh} pullMin={50} pullMax={200}>
        <IonRefresherContent
          pullingIcon={chevronDownCircleOutline}
          refreshingSpinner="circles">
        </IonRefresherContent>
      </IonRefresher> 
        {location.pathname === '/home' ? 
        <IonToast
          isOpen={newNotifications}
          cssClass={"refresh-toast"}
          onDidDismiss={() => setNewNotifications(false)}
          position = 'top'
          color="danger"
          buttons={[
            {
              side: 'start',
              text: 'new notifications',
              handler: () => {
                checkForRequests();
              }
            }
          ]}
        />     
         : null}
      {newNotifications ? <><br/><br/></> : null} 
      {reqs && reqs.map(req =>        
        <FriendRequest id={req.name} click={()=>checkForRequests()} key={req.id}/>
      )}
      {partyreqs && partyreqs.map(req => 
          (<PartyRequest hostid={req.hostid} partyid={req.partyid} click={()=>acceptInvite()} key={req.partyid}/>)
      )}
      { upcomingParties.length > 0 ? null :
        liveParties.length > 0 ? null :
        <><br/><br/><IonText class="ion-padding-start">No upcoming parties...</IonText></>
      }     
      {liveParties && liveParties.map(party => { 
        return(        
          <>
          <Party key={party.id} id={party.id} data={party.data} live={true} edit={() => setEditingParty(party.data)}/>              
          <br/>
          </>
        );                    
      })}
      {upcomingParties && upcomingParties.map(party => {
        return( 
          <>
          <Party key={party.id} id={party.id} data={party.data} live={false} edit={() => setEditingParty(party.data)}/>
          </>
        );                
      })}  
    </IonContent>   
    )
  }
}
const Create: React.FC = () => {

  const [back, setBack] = useState(false)
  
  return(
    <IonPage>
      <CreateParty editingParty={null} displayParties={() => setBack(!back)} />
    </IonPage>
  )
}

const FriendRequest = ({id, click}) => {
  // notification item
  const [userName, setUserName] = useState(''); // name of person who requested

  const userRef = firebase.firestore().collection("users").doc(id); // get document of person who requested
  userRef.get().then(function(doc) {
    if (doc.exists) { 
      setUserName(doc.data().username) // set name to the name in that document
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
              friends: firebase.firestore.FieldValue.arrayUnion({id: friend_user_id, name: userName})
            })      
          });
        } else {
          // if array doesn't exist, create the array
          collectionRef.doc(current_user_id).set({
            id: current_user_id,
            friends: [{id: friend_user_id, name: userName}]
          }) // create the document
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
                friends: firebase.firestore.FieldValue.arrayUnion({id: current_user_id, name: firebase.auth().currentUser.displayName})
              })      
            });
          } else {
            collectionRef.doc(friend_user_id).set({
              id: friend_user_id, 
              friends: [{id: current_user_id, name: firebase.auth().currentUser.displayName}]
            }) // create the document
          }
      })        
          //if successful
          .then(function(docRef) {
            //HERE IS WHERE YOU SHOULD REMOVE REQUEST from friends_requests collection
            firebase.firestore().collection("friend_requests").doc(friend_user_id).update({
              request_to: firebase.firestore.FieldValue.arrayRemove({id: current_user_id, name: firebase.auth().currentUser.displayName})
            })
                // if requests_to item is removed successfully... then remove item from request_from array
                .then(function(docRef) {
                firebase.firestore().collection("friend_requests").doc(current_user_id).update({
                  request_from: firebase.firestore.FieldValue.arrayRemove({id: friend_user_id, name: userName})                
                  //removes text display 
                }).then(() => click());                          
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

  const declineFriend = (friendsID) => {
    const collectionRef = firebase.firestore().collection("friend_requests"); 
    var friend_user_id = friendsID
    var current_user_id = firebase.auth().currentUser.uid
    //REMOVE REQUEST from friends_requests collection
    collectionRef.doc(friend_user_id).update({
      request_to: firebase.firestore.FieldValue.arrayRemove({id: current_user_id, name: firebase.auth().currentUser.displayName})
    })
      // if requests_to item is removed successfully... then remove item from request_from array
      .then(function(docRef) {
      collectionRef.doc(current_user_id).update({
        request_from: firebase.firestore.FieldValue.arrayRemove({id: friend_user_id, name: userName})                
        //removes text display 
      }).then(() => click());                          
      }).catch(function(error) {
        console.error("Error deleting id from requests_from: ", error);
      });
  }


  return(
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>
          <IonText>{userName} wants to be friends</IonText>
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
      <IonButton onClick={() => acceptFriend(id)}>
        <IonIcon size="large" icon={thumbsUpOutline} />
      </IonButton>
      <IonButton onClick={() => declineFriend(id)}>
        <IonIcon size="large" icon={thumbsDownOutline} />
      </IonButton>        
      </IonCardContent>                        
    </IonCard>    
  )
}

const PartyRequest = ({hostid, partyid, click}) => {
  // notification item
  const [userName, setUserName] = useState(''); // name of person who requested
  const [date, setDate] = useState(''); // date of party you've been invited to
  const [time, setTime] = useState(''); // time of party you've been invited to
  const [endTime, setEndTime] = useState(''); // time of party you've been invited to

  // get party document of the person who requested
  const userRef = firebase.firestore().collection("users").doc(hostid); 
  userRef.collection("myParties").doc(partyid).get().then(function(doc) {
    if (doc.exists) { 
      setUserName(doc.data().host) // set name to the host name in that document
      var date = moment(doc.data().date).format('LL')
      setDate(date)
      var end = moment(doc.data().endTime).format('LT')
      setEndTime(end)
      var time = moment(doc.data().dateTime).format('LT')
      setTime(time)
    } 
  }).catch(function(error) {
    console.log(error);
  });

  // todo - change this to appear in users.
  //if accept is clicked, inside friends collection, create doc with current user's id and add that friend's id
  //to array. If that works, inside friends collection inside the friend's document, add the current user's id.
  // If this is successful then remove eachother from requests.
  const acceptInvite = async() => {
    var current_user_id = firebase.auth().currentUser.uid
    // remove party from myinvites so the notification disappears, add to accepted invites
    firebase.firestore().collection("users").doc(current_user_id).update({
        myInvites: firebase.firestore.FieldValue.arrayRemove({hostid, partyid}),
        acceptedInvites: firebase.firestore.FieldValue.arrayUnion({hostid: hostid, partyid: partyid}),
      }).then(() => click());
  }

  const declineInvite = async() => {
    var current_user_id = firebase.auth().currentUser.uid
    // remove party from myinvites so the notification disappears, add to declined invites
    firebase.firestore().collection("users").doc(current_user_id).update({
        myInvites: firebase.firestore.FieldValue.arrayRemove({hostid, partyid}),
        declinedInvites: firebase.firestore.FieldValue.arrayUnion({hostid: hostid, partyid: partyid}),
      }).then(() => click());
  }

  return(
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>
          <IonText>{userName} has invited you to a party!</IonText>
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonText class="white-text">Starts at {time} on {date}</IonText><br/>        
        <IonText class="white-text">Ends at {endTime}</IonText><br/>        
        <IonButton color="danger" onClick={() => acceptInvite()}>Accept</IonButton>
        <IonButton color="danger" onClick={() => declineInvite()}>Decline</IonButton>        
      </IonCardContent>                        
    </IonCard>
  )
}

const MyParties: React.FC = () => {

  return(
    <IonPage>
      <MyPartyList/>
        {/* to allow for last item in list to be clicked (otherwise it's covered by tabbar) */}
        <br/> <br/> <br/> <br/> <br/> <br/>
    </IonPage>
  )
}
const Home: React.FC = () => {

  const [editing, setEditing] = useState(false);

  return(
    <IonPage>
      {editing ? null : 
      <IonToolbar class="ion-padding">
        <IonTitle class="ion-padding">Upcoming<br/>parties</IonTitle>
        <IonButtons slot="end">
          <IonButton class="top-icons" href='/users'>
            <IonIcon slot="icon-only" icon={personAddSharp} />
          </IonButton>       
        </IonButtons>                     
      </IonToolbar>}
      <PartyList editParty={() => setEditing(true)} stopEditing={()=>setEditing(false)}/>
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
          <Route path='/gallery' component={Gallery} />
          <Route path='/myparties' component={MyParties} />
          <Route exact path='/home' component={Home} />      
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
          <IonTabButton tab="myparties" href="/myparties">
            <IonIcon class="side-icons" src="assets/icon/Memories.svg" />
            MyParties
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
      if (user) { //&& user.emailVerified) { // if new user logs in and is email verified 
        setSignedIn(true)
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