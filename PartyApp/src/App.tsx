import React, { useState, useEffect} from 'react';
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
  IonBackButton
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
// Signs out of Party app.
const signOut = async() => {
  // Sign out of Firebase.
  firebase.auth().signOut();
  //alert("YOU JUST SIGNED OUT")
  }
const SignIn = () => {
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
    <IonList class="gradient">
      <IonItem>
        <IonIcon color="warning" slot="start" icon={starSharp}/>
        <IonLabel color="warning">Guest rating: </IonLabel>
      </IonItem>
      {appPages.map((appPage, index) => {
      return (
        <IonMenuToggle key={index} auto-hide="false">
        <IonItem href={appPage.url}>
            <IonIcon color="warning" slot="start" icon={appPage.icon} />
            <IonLabel color="warning">{appPage.title}</IonLabel>
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
const Gallery = ({id, click}) => {
  // party card
  const [value, loading, error] = useCollection(
    firebase.firestore().collection('parties').doc(id).collection('pictures'),
  );  
  // const deletePhoto = async() => {
  //   await collectionRef.doc(doc.id).update({
  //     picture: firebase.firestore.FieldValue.delete()
  //   })
  //   .then(function() { 
  //   console.log("field successfully deleted!")})
  //   .catch(function(error) { 
  //   console.error("Error removing document: ", error); 
  // });  
  // }
  return(     
    <IonGrid>
      <IonRow>
        <IonButton onClick={click}>
          <IonIcon icon={chevronBackSharp} />
        </IonButton>     
      </IonRow>
        <IonSlides scrollbar={false} pager={true} options={{initialSlide: 1, preloadImages: true, loop: true}}>
          {value && value.docs.map(doc => {
            return(                        
              <IonSlide key={doc.id}>
                <IonRow>
                  <IonImg src={doc.data().picture} />
                </IonRow>     
                <IonRow className="ion-padding">
                  <IonLabel>Taken at {doc.data().createdAt}</IonLabel>
                </IonRow>   
              </IonSlide>
            )
          })}      
        </IonSlides>  
    </IonGrid>
  )
} 

//TODO - 
// Add friends
// delete party document in firebase after it's happened
const Memory = ({doc, click}) => {
  // party card
  const [showToast, setShowToast] = useState(false);
  const [picture, setPicture] = useState<string>('')
  const {getPhoto} = useCamera(); 
  const collectionRef = firebase.firestore().collection("parties");
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
  let data = doc.data();
  
  return(
    <AccordionItem>
      <AccordionItemHeading>
        <AccordionItemButton>
          <IonRow>
            <IonCol size="7">
              <IonText>{data.title} <br/></IonText>
              <IonText class="white-text">{data.date}<br/></IonText> 
              <IonText class="white-text">Hosted By - ...</IonText>
            </IonCol>
            <IonCol>
              <IonButton class="custom-button" expand="block" onClick={click}>
                <IonIcon src="assets/icon/Memories.svg"/> Memories
              </IonButton>
            </IonCol>   
          </IonRow>
        </AccordionItemButton>
      </AccordionItemHeading>
      <AccordionItemPanel>
        <IonRow>
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
      <Accordion allowZeroExpanded={true} allowMultipleExpanded={true} className="gradient">
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
    <AccordionItem>
      <AccordionItemHeading>
          <AccordionItemButton>
            <IonRow>
              <IonCol size="3" >
                <IonText>{data.date}</IonText>    
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
      <IonItemGroup>  
        <IonLabel class="popover-label">Details:</IonLabel>
        <IonItem >{data.details}</IonItem>
        <IonLabel class="popover-label">Location:</IonLabel>
        <IonItem>{data.location}</IonItem>
        <IonLabel class="popover-label">Starts:</IonLabel>          
        <IonItem>{data.startTime}</IonItem>
        <IonLabel class="popover-label">Ends:</IonLabel>
        <IonItem>{data.endTime}</IonItem>
      </IonItemGroup>   
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
    <Accordion allowZeroExpanded={true} allowMultipleExpanded={true} className="gradient">
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
      <IonToolbar>
        <IonTitle>Create a party</IonTitle>  
      </IonToolbar>
      <CreateParty initialValue={current} clear={() => setCurrent(null)}/>
    </IonPage>
  )
}

const Users: React.FC = () => {

  const collectionRef = firebase.firestore().collection("friend_requests");
  const searchClient = algoliasearch('N5BVZA4FRH', '10173d946e2ba5aa9ba4f9ae445cef48');
  const index = searchClient.initIndex('Users');
  const [hits, setHits] = useState([]);
  const [query, setQuery] = useState('');
  const [addDisabled, setAddDisabled] = useState(false)
  const [cancelDisabled, setCancelDisabled] = useState(true)

  async function search(query) {
    const result = await index.search(query);
    setHits(result.hits);
    setQuery(query)    
  }
//  basically if in friend_requests, if under ur id, u have another persons id 
//  (in a collection) w a doc with request_status equal to 'received' then that
//  person's id (the collection) should be used to get the persons profile and
//  display it in inbox w "accept request". To check that u have a new friend
//  request, I think we need to use an onSnapshot function which would be always
//  listening for a new entry in friend requests under ur id i think. If you get
//  that working u can attach the accept request function to the accept button.
  const addFriend = (objectID) => {
    
    //var currentState = "not_friends"
    //var disabledState = false
    var receiver_user_id = objectID
    var sender_user_id = firebase.auth().currentUser.uid
    //console.log(receiver_user_id)

    //create doc with sender's id and adds receiver's id to collection.
    collectionRef.doc(sender_user_id).collection(receiver_user_id).add(
      {request_status: 'sent'})

      //if successful
      .then(function(docRef) {
        //console.log("Document written with ID: ", docRef.id);
        //if successful, create doc w receiver's id and add sender's id to collection
        collectionRef.doc(receiver_user_id).collection(sender_user_id).add(

          {request_status: 'received'})
          
          //if successful
          .then(function(docRef) {
            //currentState = "request_received"
            setAddDisabled(true); //disables add friend button
            setCancelDisabled(false); //enalbes cancel request button
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

  const resetButtons = () => {
    setAddDisabled(false); //disables add friend button
    setCancelDisabled(true); //enalbes cancel request button
  }

  if (hits && query !== "" && query !== " ") {
    return(
      <IonPage>
        <IonToolbar>   
          <IonSearchbar onIonChange={e => search(e.detail.value!)}></IonSearchbar>
        </IonToolbar>
        <IonContent>
          <IonList class="gradient">      
            {hits.map(hit => 
            <IonItem key={hit.objectID}>
              <IonAvatar>
                <img src={hit.photoUrl} />
              </IonAvatar>
              <IonText>{hit.name}</IonText>
              <IonButton disabled = {addDisabled} slot="end" onClick={() => addFriend(hit.objectID)}>
                <IonIcon slot="icon-only" icon={personAddSharp} />
              </IonButton>
              <IonButton disabled = {cancelDisabled} slot="end" onClick={resetButtons}>Cancel</IonButton>
            </IonItem>)}
          </IonList>
        </IonContent>
      </IonPage>    
    )
  } 
  else {
    return(
      <IonPage>
        <IonToolbar>   
          <IonSearchbar onIonChange={e => search(e.detail.value!)}></IonSearchbar>
        </IonToolbar>
        <IonContent>

        </IonContent>
      </IonPage>
    )}}

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

const CreateParty = ({initialValue, clear}) => {

  useEffect(() => {  
  },
  []);
  const [date, setDate] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [location, setLocation] = useState<string>('')
  const [details, setDetails] = useState<string>('')
  const [endTime, setEndTime] = useState<string>('')
  const [startTime, setStartTime] = useState<string>('')  
  const [searchText, setSearchText] = useState<string>('');
  const [friendList, setFriendList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [checked, setChecked] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [value, loading, error] = useDocument(
    firebase.firestore().doc("parties/" + initialValue)
  );
  const onSave = () => {  
    // validate inputs  
    const valid = Boolean((date !== "") && (title !== "") && (location !== "") && (startTime !== "") && (endTime !== "") && (details !== ""));
    
    if (valid == false) {
      setShowAlert(true)    
    } else if (valid == true) {
      setShowToast(valid);
      let collectionRef = firebase.firestore().collection("parties");
      // only add documents to collection if forms are validated
        collectionRef.add(
          {title: title, 
          location: location, 
          date: moment(date).format('LL'), 
          details: details,
          endTime: moment(endTime).format('LLL'),
          startTime: moment(startTime).format('LLL'),
          // todo convert firestore timestamp to date format
          createdOn: moment(new Date()).format('LLL'), 
          });
          //clear fields
          setTitle("");
          setDate("")
          setLocation("");
          setDetails("");
          setEndTime("");
          setStartTime("");
          clear();        
    } 
  
  }
  return(
    <IonContent class="create-content">
    <IonCard>
    <IonCardContent class="create-card-content">
      <IonList lines="full" color="warning">
        <IonItem class="create-card">
          <IonInput class="create-input" value={title} onIonChange={e => setTitle(e.detail.value!)} placeholder="Title (e.g. Bruno's 17th)" clearInput></IonInput>
        </IonItem>
        <IonItem class="create-card">
          <IonInput class="create-input" value={location} onIonChange={e => setLocation(e.detail.value!)} placeholder="Location" clearInput></IonInput>
        </IonItem>
        <IonItem class="create-card">
          <IonLabel color="dark">Date</IonLabel>
          <IonDatetime class="create-datetime" value={date} max="2050" min={moment(new Date()).format('YYYY')} onIonChange={e => setDate(e.detail.value!)}></IonDatetime>
        </IonItem>
        <IonItem class="create-card">
          <IonLabel color="dark">Starts</IonLabel>
          <IonDatetime class="create-datetime" value={startTime} onIonChange={e => setStartTime(e.detail.value!)} display-format="h:mm A" picker-format="h:mm A"></IonDatetime>
        </IonItem>
        <IonItem class="create-card">
          <IonLabel color="dark">Ends</IonLabel>
          <IonDatetime class="create-datetime" value={endTime} onIonChange={e => setEndTime(e.detail.value!)} display-format="h:mm A" picker-format="h:mm A"></IonDatetime>
        </IonItem>
        <IonItem class="create-card">
          <IonTextarea class="create-input" value={details} onIonChange={e => setDetails(e.detail.value!)} placeholder="Additional details"></IonTextarea>
        </IonItem>
        <IonButton class="custom-button" expand="block" onClick={e => setShowModal(true)}>Invite People</IonButton>
        <IonButton class="custom-button" expand="block" onClick={() => onSave()}>CREATE!</IonButton>        
      </IonList>    
      </IonCardContent>  
    </IonCard>
    <IonModal isOpen={showModal}>
      <IonHeader>
        <IonToolbar>              
          <IonGrid>
            <IonRow>
              <IonCol>
              <IonTitle className="ion-text-center" size="large">Select people to invite</IonTitle>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="9">
                <IonSearchbar value={searchText} onIonChange={e => setSearchText(e.detail.value!)} showCancelButton="focus" color="danger"></IonSearchbar>                  
              </IonCol>
              <IonCol>
                <IonButton fill="clear" onClick={e => setShowModal(false)}>Done</IonButton>
              </IonCol>                  
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList class="gradient">
          {friendList.map(({ val, isChecked }, i) => (
            <IonItem key={i}>
              <IonLabel>{val}</IonLabel>
              <IonCheckbox slot="end" color="danger" value={val} checked={isChecked} />
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonModal>
    <IonToast
      isOpen={showToast}
      onDidDismiss={() => setShowToast(false)}
      duration={2000}
      message="Party Created!"
      position="bottom"
    />
    <IonAlert
      isOpen={showAlert}
      onDidDismiss={() => setShowAlert(false)}
      header={'Alert'}
      message={'One or more input fields missing'}
      buttons={['OK']}
    />    
    </IonContent>
  )
};
const Profile: React.FC = () => {
  var user = firebase.auth().currentUser;
  return(
    <IonPage>
      <IonToolbar>
        <IonTitle>Profile</IonTitle>
        <IonButton href="/signin" slot="end" onClick={() => signOut()}>SignOut</IonButton>
      </IonToolbar>
      <IonContent>
        <IonCard>           
          <IonGrid>
            <IonRow>
              <IonCol size="8">
                <IonCardSubtitle>{user.displayName}</IonCardSubtitle>
                <IonCardTitle>(Username)</IonCardTitle>
              </IonCol>
              <IonCol className="ion-text-right">
                <IonButton>
                  <IonIcon icon={createSharp} />
                </IonButton>                
              </IonCol>
            </IonRow>        
          </IonGrid>      
        </IonCard>
      </IonContent>
    </IonPage>
  )
}
const Inbox: React.FC = () => {
  return(
    <IonPage>
      <IonToolbar>
        <IonTitle>Notifications</IonTitle>
      </IonToolbar>
      <IonContent>
        Invites....
        <FriendRequests />
      </IonContent>
    </IonPage>
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
      </IonContent>
    </IonPage>
  )
}
const Home: React.FC = () => {
  return(
    <IonPage>
      <IonToolbar>
        <IonButtons slot="start">
          <IonMenuButton autoHide={false} menu="main-menu"></IonMenuButton>        
        </IonButtons>  
        <IonButtons slot="end">   
          <IonButton href='/users'>
            <IonIcon icon={personAddSharp} />
          </IonButton>          
        </IonButtons>                
        <IonTitle>Upcoming parties</IonTitle>
      </IonToolbar>
      <IonContent>     
        <PartyList />     
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
            <Route path='/profile' component={Profile} />
            <Route path='/inbox' component={Inbox} />
            <Route path='/chat' component={Chat} />
            <Route path='/gallery' component={Gallery} />
            <Route path='/memories' component={Memories} />
            <Route path='/home' component={Home} exact />      
            <Route exact path={["/signin", "/"]} render={() => <Redirect to="/home" />} />
          </IonRouterOutlet> 
        
          <IonTabBar slot="bottom">
            <IonTabButton tab="home" href="/home">
              <IonIcon icon={home} />
              <IonLabel>Home</IonLabel>
              <IonRippleEffect></IonRippleEffect>
            </IonTabButton>
            <IonTabButton tab="memories" href="/memories">
              <IonIcon class="side-icons" src="assets/icon/Memories.svg" />
              <IonLabel>Memories</IonLabel>
              <IonRippleEffect></IonRippleEffect>
            </IonTabButton>            
            <IonTabButton tab="create" href="/create">
              <IonIcon class="mid-icon" src="assets/icon/Create.svg" />
              <IonLabel>Create</IonLabel>
              <IonRippleEffect></IonRippleEffect>
            </IonTabButton>  
            <IonTabButton tab="profile" href="/profile">
              <IonIcon class="side-icons" src="assets/icon/People.svg" />
              <IonLabel>Profile</IonLabel>
              <IonRippleEffect></IonRippleEffect>                
            </IonTabButton>                
            <IonTabButton tab="inbox" href="/inbox">
              <IonIcon icon={notificationsSharp} />
              <IonLabel>Inbox</IonLabel>
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
        isOpen={loading} 
        onDidDismiss={() => setLoading(false)} 
        message={'Loading...'} />  
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