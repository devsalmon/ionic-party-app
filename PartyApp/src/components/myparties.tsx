import React, {useState, useEffect, useRef} from 'react';
import {Redirect} from 'react-router-dom';
import {
  IonText,
  IonPopover,
  IonList,
  IonInput,
  IonMenu,
  IonRouterOutlet,
  IonItem,
  IonImg,
  IonRefresher,
  IonRefresherContent,
  IonToolbar,
  IonToast,
  IonTitle,
  IonRadioGroup,
  IonRadio,
  IonContent,
  IonIcon,
  IonButtons,
  IonButton,
  IonHeader,
  IonRow,
  IonGrid,
  IonSlides,
  IonSlide,
  IonCol,
  IonAvatar,
  IonMenuButton,
  IonItemDivider,
  IonLabel
} from '@ionic/react';
import firebase from '../firestore';
import moment from 'moment';

import {useCamera} from '@ionic/react-hooks/camera';
import {CameraResultType, CameraSource, Plugins} from '@capacitor/core';

import Gallery from './gallery';
import Memory from './memory';

import { 
  chevronBackSharp,
  settingsSharp,
  personOutline,
  chevronDownCircleOutline
} from 'ionicons/icons';
import '../App.css'
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

const MyPartyList = () => {

  const slides = useRef(null);
  const [yourParties, setYourParties] = useState([]);  
  const [attendedParties, setAttendedParties] = useState([]);  
  const [selected, setSelected] = useState('attended');
  const [partyID, setPartyID] = useState<string>('');
  const [hostID, setHostID] = useState<string>('');
  const [inGallery, setInGallery] = useState(false);
  const [friend_no, setFriend_no] = useState<number>();

  const [showFriends, setShowFriends] = useState(false);
  const [usernamePopover, setUsernamePopover] = useState(false); //popover to change username
  const [newUsername, setNewUsername] = useState('');
  const [passwordPopover, setPasswordPopover] = useState(false); //popover to change password
  const [deleteAccPopover, setDeleteAccPopover] = useState(false); 
  const [oldPassword, setOldPassword] = useState(''); //popover to change username
  const [newPassword, setNewPassword] = useState(''); //popover to change username
  const [verifyNewPassword, setVerifyNewPassword] = useState(''); //popover to change username
  const [passwordError, setPasswordError] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');  
  const [photoPopover, setPhotoPopover] = useState(false); 
  const [showPhotoSaved, setShowPhotoSaved] = useState(false);
  const [showPhotoDeleted, setShowPhotoDeleted] = useState(false);

  const [friends, setFriends] = useState([]);
  const [refresh, setRefresh] = useState(false);  
  var user = firebase.auth().currentUser;
  var currentuser = firebase.auth().currentUser.uid;


  useEffect(() => {  
    findFriends();  
    // useeffect hook only runs after first render so it only runs once
    displayParties();
    //finds the number of friends you have.
    firebase.firestore().collection("friends")
    .doc(currentuser).get().then(function(doc) {
        if (doc.exists) {
          setFriend_no(doc.data().friends.length)
        }
      })    
    // useeffect makes display parties only runs once
  }, [refresh]);  

  var user = firebase.auth().currentUser;  
  const friendsCollection = firebase.firestore().collection('friends');
  const usersCollection = firebase.firestore().collection('users');
  var tempFriends = []; // list for friend id's

  function doRefresh(event) {
    // toggle new parties so displayParties runs and it checks for new parties
    displayParties();
    setRefresh(!refresh);         
    setTimeout(() => {
      event.detail.complete();
    }, 2000);
  }     

  const findFriends = () => {
      // loop through friends list in the document of current user in friends collection    
      // and add all the id's into tempFriends
      friendsCollection.doc(user.uid).get().then(doc => {
        if (doc.exists) {
          let data = doc.data().friends && doc.data().friends;
          data && data.map(friend => {
              tempFriends.push(friend)
          })
          // loop through tempFriends and get all user documents of those id's, and add to friends array
          tempFriends && tempFriends.map(friend => {
              usersCollection.doc(friend.id).get().then(doc => {
                  let data = doc.data();
                  data && setFriends(friends => [
                      ...friends, 
                      {
                          name: data.username,
                          id: doc.id
                      }
                  ]);  
              });
          })  
        }              
      })
  }

  // Signs out of Party app.
  const signOut = async() => {
    // Sign out of Firebase.
    firebase.auth().signOut();
    //alert("YOU JUST SIGNED OUT")
  }

  const updateUsername = () => {
    setPasswordError('');
    user = firebase.auth().currentUser
    user.updateProfile({
      displayName: newUsername
    });
    firebase.firestore().collection('users').doc(user.uid).update({
      username: newUsername,  
    }).then(() => {
      setUsernamePopover(false);
      setNewUsername('');
    })    
  }

  const updatePassword = () => {
    setPasswordError('');
    user = firebase.auth().currentUser
    const credential = firebase.auth.EmailAuthProvider.credential(
      user.email, 
      oldPassword
    );            
    if (newPassword !== verifyNewPassword) {
      setPasswordError("passwords don't match");
    } else {        
      // Now you can use that to reauthenticate
      user.reauthenticateWithCredential(credential).then(function() {
        user.updatePassword(newPassword).then(function() {
          setPasswordPopover(false);
          setOldPassword('');
          setNewPassword('');
          setVerifyNewPassword('');
        }).catch(function(error) {
          setPasswordError(error.message);
        });        
      }).catch(function(error) {
        setPasswordError(error.message);
      });    
    } 
  } 

  const deleteAccount = () => {
    var user = firebase.auth().currentUser;
    const credential = firebase.auth.EmailAuthProvider.credential(
      user.email, 
      oldPassword
    ); 
    // Now reauthenticate user then delete from firebase auth
    user.reauthenticateWithCredential(credential).then(function() {
      user.delete();
      setOldPassword('');
      setPasswordError('');
      return(<Redirect to="/signin" />)
    }).catch(error => {
      setPasswordError(error.message)
    })
  }  

  // if memory card clicked, go to gallery
  const enter = (partyid, hostid) => {
    setPartyID(partyid)
    setHostID(hostid)    
    setInGallery(true)
  }  

 const displayParties = () => {          
    // get your parties
    firebase.firestore().collection("users")
      .doc(currentuser).collection("myParties").get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          let today = new Date();
          let data = doc.data();          
          // if party is in the future and party isn't already in the state 
          var alreadyInYP = yourParties.some(item => doc.id === item.id);
          if (moment(today).isAfter(data.dateTime) && !alreadyInYP) { 
            setYourParties(parties => [
              ...parties, 
              {
                id: doc.id,
                data: doc.data()
              }              
            ]);
          } 
        })
      })

    // get attended parties
    firebase.firestore().collection("users")
      .doc(currentuser).get().then(doc => {
          let today = new Date();
          let data = doc.data();
          if (data.acceptedInvites) {
            for (var i=0; i < data.acceptedInvites.length; i++) {
              firebase.firestore().collection("users")
                .doc(data.acceptedInvites[i].hostid).collection("myParties").doc(data.acceptedInvites[i].partyid).get().then(partydoc => {
                  // if party is in the future and party isn't already in the state 
                  var alreadyInAP = attendedParties.some(item => partydoc.id === item.id);
                  if (moment(today).isAfter(partydoc.data().dateTime) && !alreadyInAP) {
                    // if party is live
                    setAttendedParties(parties => [
                      ...parties,
                      {
                        id: partydoc.id,
                        data: partydoc.data()
                      }
                    ])            
                  }
              })
            }                   
          }
    });      
  }  

  const handleSlideChange = async() => {
    const swiper = await slides.current.getSwiper();
    if (swiper.activeIndex === 0) {
      setSelected("attended")
    } else {
      setSelected("hosted")
    }
  }

  const changeSlide = async(direction) => {
    const swiper = await slides.current.getSwiper();
    if (direction === "next") {
      swiper.slideNext()
    } else if (direction === "prev") {
      swiper.slidePrev()
    }
  }

  // const { Camera } = Plugins;
  // const updatePhoto = async() => {
  //   const cameraPhoto = await Camera.getPhoto({
  //     resultType: CameraResultType.Uri,
  //     source: CameraSource.Prompt,
  //     quality: 100,
  //     allowEditing: true
  //   });
  //   var photo = cameraPhoto.webPath;
  //   setProfilePhoto(photo);        
  // }

  // const saveNewPhoto = async() => {
  //   firebase.storage().ref('users/' + currentuser + '/profile.jpg').putString(profilePhoto).then(function() {
  //     setShowPhotoSaved(true)
  //     setProfilePhoto(profilePhoto);
  //   }).catch(function(error) {
  //     console.log(error.message)
  //   });  
  //   await user.updateProfile({
  //     photoURL: profilePhoto
  //   }).then(function() {
  //     console.log("photo saved to auth profile")
  //   }).catch(function(error) {
  //     console.log(error.message)
  //   });  
  // }

  // const deletePhoto = async() => {
  //   firebase.storage().ref('users/' + currentuser + '/profile.jpg').delete().then(() => {
  //     setShowPhotoDeleted(true);
  //   })
  //   await user.updateProfile({
  //     photoURL: ''
  //   }).then(function() {
  //   }).catch(function(error) {
  //     console.log(error.message)
  //   });     
  // }

  const exitGallery = () => {
    setInGallery(false)    
    setSelected("attended")
  }

  if (inGallery) {
    return(
        <>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton color="warning" fill="clear" onClick={() => exitGallery()}>
              <IonIcon icon={chevronBackSharp} />
            </IonButton>
          </IonButtons>
          <IonTitle>My Parties</IonTitle>
          <IonButtons slot="end">
            <IonButton disabled></IonButton>
          </IonButtons>
        </IonToolbar>
        <Gallery hostid={hostID} partyid={partyID} key={partyID}/>
        </>
      )
  } else {
    return(
        <>
        <IonMenu side="end" type="overlay" contentId="myPartiesPage">
          <IonHeader>
            <IonToolbar>
              <IonTitle>Settings</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent class="list">
            <IonList class="list">      
              <IonButton href="/signin" onClick={() => signOut()}>
                Sign out              
              </IonButton> <br/>
              <IonButton onClick={() => setUsernamePopover(true)}>
                Change username              
              </IonButton> <br/>
              {/* <IonButton onClick={() => setPhotoPopover(true)}>
                Change photo             
              </IonButton> <br/>               */}
              <IonButton onClick={() => setPasswordPopover(true)}>
                Change password              
              </IonButton><br/>
              <IonButton onClick={() => setDeleteAccPopover(true)}>
                Delete Account             
              </IonButton><br/>                
              <IonButton>
                Notifications
              </IonButton><br/>          
              <IonButton>
                Help
              </IonButton>                 
            </IonList>
          </IonContent>
        </IonMenu>
        <IonRouterOutlet></IonRouterOutlet>

        <div id="myPartiesPage">
        <IonHeader>
          <IonToolbar>
            <IonTitle size="large">My Parties</IonTitle>
          </IonToolbar>
          <IonItem class="accordion-profile" lines="none">
            <IonGrid>
              <IonRow>
                <IonCol size="3">
                  <IonIcon className="profile-icon" icon={personOutline}/>                   
                </IonCol>
                <IonCol size="6"> 
                  <IonText>{user.displayName}</IonText><br/>
                  <p className="white-text"><span onClick={()=>setShowFriends(true)}>{friend_no} FRIENDS</span></p>       
                </IonCol>      
                <IonCol size="3">
                  <IonMenuButton class="top-icons">
                    <IonIcon icon={settingsSharp}></IonIcon>
                  </IonMenuButton>                
                </IonCol>
              </IonRow>      
            </IonGrid> 
          </IonItem>
          <IonRadioGroup value={selected} onIonChange={e => setSelected(e.detail.value)}>
          <IonRow>
            <IonCol>
              <IonItem class="radio-buttons" lines="none">
                <IonText>Attended</IonText>
                <IonRadio onIonFocus={(e) => changeSlide("prev")} slot="end" value="attended" />
              </IonItem>
            </IonCol>
            <IonCol>
              <IonItem class="radio-buttons" lines="none">
                <IonText>Hosted</IonText>
                <IonRadio onIonFocus={e => changeSlide("next")} slot="end" value="hosted" />
              </IonItem>
            </IonCol>
          </IonRow>
          </IonRadioGroup>                                
        </IonHeader>       
        <IonContent fullscreen={true}>         
          <IonRefresher slot="fixed" onIonRefresh={doRefresh} pullMin={50} pullMax={200}>
            <IonRefresherContent
              pullingIcon={chevronDownCircleOutline}
              refreshingSpinner="circles">
            </IonRefresherContent>
          </IonRefresher>               
        <IonSlides ref={slides} onIonSlideDidChange={e => handleSlideChange()}>                   
          <IonSlide>     
          <IonContent fullscreen={true} scroll-y="true">         
            {attendedParties.length === 0 ?
            <IonText class="white-text">No attended parties yet..</IonText> :          
            attendedParties.map(doc => {
              return(
                <Memory id={doc.id} data={doc.data} key={doc.id} click={() => enter(doc.id, doc.data.hostid)}/>
              )          
            })}
          </IonContent>
          </IonSlide><br/><br/><br/>                
          <IonSlide>
          <IonContent fullscreen={true} scroll-y="true">       
            {yourParties.length === 0 ?
            <IonText class="white-text"> No hosted parties yet..</IonText> : 
            yourParties.map(doc => {
              return(              
                <Memory id={doc.id} data={doc.data} key={doc.id} click={() => enter(doc.id, doc.data.hostid)}/>
              )          
            })}                    
          </IonContent>
          </IonSlide><br/><br/><br/>
        </IonSlides> 
        </IonContent> 
        <IonPopover
          cssClass="popover"        
          isOpen={usernamePopover}
          onDidDismiss={() => setUsernamePopover(false)}
        >
          <IonInput 
          class="create-input" 
          value={newUsername} 
          onIonChange={e => setNewUsername(e.detail.value!)} 
          placeholder="New Username" clearInput>            
          </IonInput>
          <IonButton onClick={() => updateUsername()}>Done</IonButton>             
        </IonPopover>
        {/* <IonPopover
          cssClass="popover"        
          isOpen={photoPopover}
          onDidDismiss={() => setPhotoPopover(false)}
        >
        <IonButton onClick={() => updatePhoto()}>New Profile Photo</IonButton>        
        {profilePhoto ? <IonImg src={profilePhoto}></IonImg> : null}   
        {profilePhoto ? <IonButton class="custom-button" onClick={()=>saveNewPhoto()}>Save New Photo</IonButton> : null}
        <IonButton onClick={() => deletePhoto()}>Delete Profile Photo</IonButton>                     
        </IonPopover>         */}
        <IonPopover
          cssClass="popover"        
          isOpen={passwordPopover}
          onDidDismiss={() => setPasswordPopover(false)}
        >
          <IonInput 
          class="create-input" 
          value={oldPassword} 
          onIonChange={e => setOldPassword(e.detail.value!)} 
          placeholder="Old Password" clearInput>            
          </IonInput>
          <IonInput 
          class="create-input" 
          value={newPassword} 
          onIonChange={e => setNewPassword(e.detail.value!)} 
          placeholder="New Password" clearInput>            
          </IonInput>
          <IonInput 
          class="create-input" 
          value={verifyNewPassword} 
          onIonChange={e => setVerifyNewPassword(e.detail.value!)} 
          placeholder="Re-enter New Password" clearInput>            
          </IonInput>              
          <IonText>{passwordError}</IonText>                
          <IonButton onClick={() => updatePassword()}>Done</IonButton>             
        </IonPopover>    
        <IonPopover
          cssClass="popover"        
          isOpen={deleteAccPopover}
          onDidDismiss={() => setDeleteAccPopover(false)}
        >
          <IonText className="ion-padding">Delete Account?</IonText><br/>
          <IonText class="white-text">You won't be able to recover this account</IonText><br/>
          <IonInput 
          class="create-input" 
          value={oldPassword} 
          onIonChange={e => setOldPassword(e.detail.value!)} 
          placeholder="Enter password to delete account" clearInput>            
          </IonInput>    
          <IonText>{passwordError}</IonText>
          <IonButton onClick={()=>setDeleteAccPopover(false)}>
            Cancel
          </IonButton>            
          <IonButton onClick={()=>deleteAccount()}>
            Delete
          </IonButton>   
        </IonPopover>    
        <IonPopover 
          cssClass="popover"        
          isOpen={showFriends}
          onDidDismiss={() => setShowFriends(false)}        
        >
          <IonList class="list">
              {friends && friends.map(friend => {
                  return(
                    <IonItem class="accordion-item" key={friend.id}>
                        <IonText>{friend.name}</IonText>
                    </IonItem>
                  )
              })}
          </IonList>
        </IonPopover>
        <IonToast
          isOpen={showPhotoSaved}
          cssClass={"refresh-toast"}
          onDidDismiss={() => setShowPhotoSaved(false)}
          position = 'bottom'
          color="danger"
          duration={2000}
        />      
        <IonToast
          isOpen={showPhotoDeleted}
          cssClass={"refresh-toast"}
          onDidDismiss={() => setShowPhotoDeleted(false)}
          position = 'bottom'
          color="danger"
          duration={2000}
        />           
        </div>    
      </>
    )
  }
}

export default MyPartyList;