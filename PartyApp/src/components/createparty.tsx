import React, { useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import MapContainer from './mapcontainer';
import App from '../App';
import {
  IonLabel,
  IonFooter,
  IonItem,
  IonButton,
  IonButtons,
  IonBackButton,
  IonCol,
  IonGrid,
  IonRow,
  IonHeader, 
  IonContent, 
  IonToolbar, 
  IonTitle,
  IonSearchbar,
  IonPopover,
  IonInput,
  IonModal, 
  IonDatetime,
  IonTextarea,
  IonToast,
  IonAlert,
  IonIcon,
  IonList,
  IonText,
  IonRange,
  CreateAnimation
} from '@ionic/react';
import { 
  chevronBackSharp,  
  personOutline,
  addOutline,
  removeOutline,
  manOutline,
  womanOutline
} from 'ionicons/icons';
import '../App.css'
import firebase from '../firestore'
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
import '../variables.css';
import algoliasearch from 'algoliasearch/lite';

const CreateParty = ({editingParty, displayParties}) => {

    var currentuser = firebase.auth().currentUser; 
    const friendsCollection = firebase.firestore().collection('friends'); 
    const usersCollection = firebase.firestore().collection('users');

    useEffect(() => {
      findFriends()
    }, [])
  
  const findFriends = () => {
    var tempFriends = []; // list for friend id's
    // loop through friends list in the document of current user in friends collection    
    // and add all the id's into tempFriends
    friendsCollection.doc(currentuser.uid).get().then(doc => {
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

    var history = useHistory();

    // function to hide tabs when in the create page
    // function hideTab() {
    //   const tabBar = document.getElementById('appTabBar');
    //   tabBar.style.display = 'none';
    // }
    // show tabs again when create page is exited
    // function showTab() {       
    //   backButton() 
    //   const tabBar = document.getElementById('appTabBar');
    //   tabBar.style.display = 'flex';
    // }        

    const [friends, setFriends] = useState([]); // list of people who can be searched for when inviting people
    const [invitedPeople, setInvitedPeople] = useState(editingParty ? editingParty.invited_people : []); // array of invited people
    const [title, setTitle] = useState<string>(editingParty ? editingParty.title : "");
    const [address, setAddress] = useState<string>(editingParty ? editingParty.address : "");
    const [postcode, setPostcode] = useState<string>(editingParty ? editingParty.postcode : "");
    const [dresscode, setDresscode] = useState<string>(editingParty ? editingParty.dresscode : "");
    const [details, setDetails] = useState<string>(editingParty ? editingParty.details : "");
    const [endTime, setEndTime] = useState<string>(editingParty ? editingParty.endTime : "");
    const [dateTime, setDateTime] = useState<string>(editingParty ? editingParty.dateTime : ""); 
    const [drinksProvided, setDrinksProvided] = useState(editingParty ? editingParty.drinksProvided : "");
    const [malesToFemales, setMalesToFemales] = useState(editingParty ? editingParty.malesToFemales : 50);
    const [showPeopleSearch, setShowPeopleSearch] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [fieldsMissing, setFieldsMissing] = useState(false);
    const [timeError, setTimeError] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [showPopover, setShowPopover] = useState(false);
    const [partyDeletedToast, setPartyDeletedToast] = useState(false);    

    const searchClient = algoliasearch('N5BVZA4FRH', '10173d946e2ba5aa9ba4f9ae445cef48');
    const index = searchClient.initIndex('Users');
    const [hits, setHits] = useState([]);
    const [query, setQuery] = useState('');
    
    async function search(query) {
      const result = await index.search(query); 
      setHits(result.hits);
      setQuery(query)    
    }

    const onSave = () => {  
      // validate inputs  
      const inputsFilled = Boolean((title !== "") && (address !== "") && (postcode !== "") && (dateTime !== "") && (endTime !== "") && (dresscode !== "") && (drinksProvided !== ""));
      const timesValid = Boolean(moment(endTime).isAfter(dateTime));
      const collectionRef = firebase.firestore().collection("users").doc(currentuser.uid).collection("myParties");
      
      if (inputsFilled === false) {
        setFieldsMissing(true)  
      } else if (timesValid === false) {
        setTimeError(true)
      } else if (inputsFilled === true && timesValid === true) {
          // if editing party, update the document, otheriwse add a new document 
          if (editingParty) {
            console.log("editing")
            collectionRef.doc(editingParty.id).update({
              title: title, 
              address: address,
              postcode: postcode,
              dresscode: dresscode,
              drinksProvided: drinksProvided,
              malesToFemales: malesToFemales,
              date: moment(dateTime).format('LL'), 
              day: moment(dateTime).format('D'), 
              month: moment(dateTime).format('MMM'),
              details: details ? details : "",
              endTime: moment(endTime).format('LLL'),
              dateTime: moment(dateTime).format('LLL'),
              invited_people: invitedPeople,             
              }).then(function() {
                setShowToast(true);
                // if people get invited then add them to list below.
                // A party gets created. A person gets invited, they accept invite.
                // Then they get access to the document that was originally created.
                var host_user_id = firebase.auth().currentUser.uid
                invitedPeople && invitedPeople.map(person => {
                  var userDocument = firebase.firestore().collection("users").doc(person.id)
                  userDocument.get().then(doc => {
                    if (doc.data().myInvites) {
                      var alreadyInMI = doc.data().myInvites.some(item => editingParty.id === item);
                      var alreadyInIF = doc.data().inviteFrom.some(item => host_user_id === item);                    
                    }
                    if ((!alreadyInMI && !alreadyInIF) || !doc.data().myInvites) {
                      userDocument.update({
                        // add party id to user documents
                        myInvites: firebase.firestore.FieldValue.arrayUnion({hostid: host_user_id, partyid: editingParty.id}),                      
                      }) 
                    }   
                  })
                })
              //clear fields
              setTitle("");
              setAddress("");
              setPostcode("");
              setDetails("");
              setEndTime("");
              setDateTime("");
              setDresscode("");
              setDrinksProvided("");
              setMalesToFemales(0);
              setInvitedPeople([]);                               
              })  
            } else {
            // only add documents to collection if forms are validated
              collectionRef.add({
                title: title, 
                address: address,
                postcode: postcode,
                dresscode: dresscode,
                drinksProvided: drinksProvided,
                malesToFemales: malesToFemales,
                date: moment(dateTime).format('LL'), 
                day: moment(dateTime).format('D'), 
                month: moment(dateTime).format('MMM'),
                details: details ? details : "",
                endTime: moment(endTime).format('LLL'),
                dateTime: moment(dateTime).format('LLL'),
                host: firebase.auth().currentUser.displayName,
                hostid: firebase.auth().currentUser.uid,
                invited_people: invitedPeople,             
                createdOn: moment(new Date()).format('LL'), 
                }).then(function(docRef) {                  
                  console.log(docRef.id)
                  setShowToast(true);
                  collectionRef.doc(docRef.id).update({
                    id: docRef.id
                  })
                  // if people get invited then add them to list below.
                  // A party gets created. A person gets invited, they accept invite.
                  // Then they get access to the document that was originally created.
                  var host_user_id = firebase.auth().currentUser.uid
                  invitedPeople && invitedPeople.map(person => {
                    firebase.firestore().collection("users").doc(person.id).update({
                      // add party id to user documents
                      myInvites: firebase.firestore.FieldValue.arrayUnion({hostid: host_user_id, partyid: docRef.id}),                      
                    })                
                    .catch(function(error) {
                      console.error("error adding party id to user document", error);
                    })           
                  })   
                  //clear fields
                  setTitle("");
                  setAddress("");
                  setPostcode("");
                  setDetails("");
                  setEndTime("");
                  setDateTime("");
                  setDresscode("");
                  setDrinksProvided("");
                  setMalesToFemales(0);
                  setInvitedPeople([]);                
              })  
            }     
          }    
        }          
      

    const addInvite = (id, username) => {
      setQuery(''); // reset searchbar when invite button pressed so invite item with the button stops showing
      setInvitedPeople(invitedPeople => [
        ...invitedPeople, 
        {              
          username: username,
          id: id
        }
      ]);
      console.log(invitedPeople)
    }

    const removeInvite = (id) => {
      setRefresh(false);
      setQuery(''); // reset searchbar when invite button pressed so invite item with the button stops showing
      for (var i=0; i < invitedPeople.length; i++) {
        if (invitedPeople[i].id === id) {
            invitedPeople.splice(i,1);
            setRefresh(true);
            break;
        }   
      }      
    }

    const deleteParty = async() => {
      // remove invites for all invited people
      await invitedPeople && invitedPeople.map(person => {
        firebase.firestore().collection("users").doc(person.id).update({         
          myInvites: firebase.firestore.FieldValue.arrayRemove({hostid: currentuser.uid, partyid: editingParty.id}),
          acceptedInvites: firebase.firestore.FieldValue.arrayRemove({hostid: currentuser.uid, partyid: editingParty.id})
        })
      })
      // delete party document from firebase
      firebase.firestore().collection("users")
        .doc(currentuser.uid).collection("myParties").doc(editingParty.id).delete().then(() => {
          setTitle("");
          setAddress("");
          setPostcode("");
          setDetails("");
          setEndTime("");
          setDateTime("");
          setInvitedPeople([]);  
          setShowPopover(false);
          setPartyDeletedToast(true);
        })    
    }

    const enterAnimation = (baseEl: any) => {
      // const backdropAnimation = createAnimation()
      //   .addElement(baseEl.querySelector('ion-backdrop')!)
      //   .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

      // const wrapperAnimation = createAnimation()
      //   .addElement(baseEl.querySelector('.modal-wrapper')!)
      //   .keyframes([
      //     { offset: 0, opacity: '0', transform: 'scale(0)' },
      //     { offset: 1, opacity: '0.99', transform: 'scale(1)' }
      //   ]);

      // return createAnimation()
      //   .addElement(baseEl)
      //   .easing('ease-out')
      //   .duration(500)
      //   .addAnimation([backdropAnimation, wrapperAnimation]);
    }

    const leaveAnimation = (baseEl: any) => {
      //return enterAnimation(baseEl).direction('reverse');
    }    

    return(
      <IonContent class="create-content" fullscreen={true}>
        <IonToolbar color="warning" className="ion-padding">
          {editingParty ? <IonButtons slot="start" class="create-back-button">
            <IonButton fill="clear" color="dark" href="/home">
              <IonIcon slot="icon-only" icon={chevronBackSharp}></IonIcon>
            </IonButton>
          </IonButtons> : null}            
          {editingParty ? <IonTitle color="dark">Editing</IonTitle> : 
            <IonTitle color="dark">Create</IonTitle>
          }  
        </IonToolbar>
          <IonItem class="rounded-top" lines="none">
            <IonInput class="create-input" value={title} onIonChange={e => setTitle(e.detail.value!)} placeholder="Title" clearInput></IonInput>
          </IonItem>
          <IonItem class="create-card" lines="none">   
            <IonInput class="create-input" value={address}  onIonChange={e => setAddress(e.detail.value!)} placeholder="Address" clearInput></IonInput>                               
          </IonItem>
          <IonItem class="create-card" lines="none">   
            <IonInput class="create-input" value={postcode}  onIonChange={e => setPostcode(e.detail.value!)} placeholder="Postcode/Zipcode" clearInput></IonInput>                               
          </IonItem>
          <IonItem class="create-card" lines="none">
            <IonInput class="create-input" value={dresscode}  onIonChange={e => setDresscode(e.detail.value!)} placeholder="Dress Code" clearInput></IonInput>  
          </IonItem>
          <IonItem class="create-card" lines="none">
            <IonInput class="create-input" value={drinksProvided}  onIonChange={e => setDrinksProvided(e.detail.value!)} placeholder="Drinks Provided" clearInput></IonInput>  
          </IonItem>         
          <IonItem class="create-card" lines="none">
            <IonLabel color="warning">Starts</IonLabel>
            <IonDatetime class="create-datetime" value={dateTime} onIonChange={e => setDateTime(e.detail.value!)} displayFormat="DD-MMM-YY HH:mm" placeholder="select"></IonDatetime>
          </IonItem>
          <IonItem class="create-card" lines="none">
            <IonLabel color="warning">Ends</IonLabel>
            <IonDatetime class="create-datetime" value={endTime} onIonChange={e => setEndTime(e.detail.value!)} displayFormat="DD-MMM-YY HH:mm" placeholder="select"></IonDatetime>
          </IonItem>        
          <IonItem class="create-card" lines="none">
            <IonText color="warning">Male:Female ratio</IonText>
          </IonItem>
          <IonItem class="create-card" lines="none">            
            <IonRange value={malesToFemales}  onIonChange={e => setMalesToFemales(e.detail.value!)}>
              <IonIcon slot="start" icon={manOutline} />
              <IonIcon slot="end" icon={womanOutline} />
            </IonRange>
          </IonItem>
          <IonItem class="create-card" lines="none">
            <IonTextarea maxlength={150} class="create-input" value={details} onIonChange={e => setDetails(e.detail.value!)} placeholder="Additional details"></IonTextarea>
          </IonItem>
          <IonItem class="create-card" lines="none">
            <IonButton class="create-button" expand="block" onClick={e => setShowPeopleSearch(true)}>Invite People</IonButton>
          </IonItem>       
          {invitedPeople && invitedPeople.map(person => {
            return(
              <IonItem class="create-card" lines="none" key={person.id}>                
                <IonText>{person.username}</IonText>
                <IonButton slot="end" onClick={() => removeInvite(person.id)}>
                  <IonIcon size="large" icon={removeOutline} /> 
                </IonButton>
              </IonItem>
            )
          })}  
          <IonItem class="rounded-bottom"> 
            <IonButton 
            class="create-button" 
            expand="block"            
            onClick={() => onSave()}
            >{editingParty ? "Update!" : "Create!"}</IonButton>        
          </IonItem><br/><br/><br/><br/><br/><br/>
          {editingParty ? 
            <IonButton color="danger" class="create-button" onClick={() => setShowPopover(true)}>Delete party</IonButton> :
          null}
             
      <IonModal swipeToClose={true} isOpen={showPeopleSearch} /*enterAnimation={enterAnimation} leaveAnimation={leaveAnimation}*/>
        <IonHeader>
          <IonToolbar>  
            <IonSearchbar class="searchbar" onIonChange={e => search(e.detail.value!)} placeholder="Search Friends"></IonSearchbar>                            
          </IonToolbar>
        </IonHeader>
        <IonContent class="create-content">
          {query.trim() !== "" && (/[a-zA-z]//*all letters */).test(query) && hits.map(hit => (
            hit.objectID === currentuser.uid || !friends.includes(hit.objectID) ? null :
            <IonItem class="create-input"> 
              <IonRow key={hit.objectID} class="ion-align-items-center">                   
                <IonCol size="3">
                  <IonIcon icon={personOutline} className="profile-icon" />
                </IonCol>
                <IonCol size="6" offset="1">
                  <IonText>{hit.username}</IonText>   
                </IonCol>                            
                <IonCol size="2">
                  <IonButton onClick={() => addInvite(hit.objectID, hit.username)}>
                    <IonIcon size="large" icon={addOutline} />
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonItem>            
          ))}<br/>    

          <IonText color="dark">Friends:</IonText><br/>
          
          {query ? friends.map(friend => ( // show all friends below the searched items
            <IonItem class="create-input"> 
              <IonRow class="ion-align-items-center" key={friend.id}>                   
                <IonCol size="3">
                  <IonIcon icon={personOutline} className="profile-icon" />
                </IonCol>
                <IonCol size="6" offset="1">
                  <IonText>{friend.name}</IonText>   
                </IonCol>                            
                <IonCol size="2">
                  <IonButton onClick={() => addInvite(friend.id, friend.name)}>
                    <IonIcon size="large" icon={addOutline} />                    
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonItem>              
          )) : null}      
          <IonItem class="create-card" lines="none">
            <IonText>People invited: </IonText>
          </IonItem>
          {invitedPeople && invitedPeople.map(person => {
            return(
              <IonItem class="create-card" lines="none" key={person.id}>                
                <IonText>{person.username}</IonText>
                <IonButton slot="end" onClick={() => removeInvite(person.id)}>
                  <IonIcon size="large" icon={removeOutline} />  
                </IonButton>
              </IonItem>
            )
          })}<br/>                    
        </IonContent>
        <IonFooter>
          <IonButton class="custom-button" onClick={e => setShowPeopleSearch(false)}>Add People</IonButton>
        </IonFooter>        
      </IonModal>  
      <IonPopover
        cssClass="create-popover"        
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
      >
        <div className="ion-text-center">
        <IonButton class="create-popover" href="/home">
          Party Created! <br/> Click here to see it
        </IonButton>   
        </div>
      </IonPopover> 
      <IonToast
        isOpen={partyDeletedToast}
        onDidDismiss={() => setPartyDeletedToast(false)}
        duration={2000}
        message="Party Deleted!"
        position="bottom"
      />      
      <IonAlert
        isOpen={fieldsMissing}
        onDidDismiss={() => setFieldsMissing(false)}
        header={'Alert'}
        message={"One or more input fields missing"}
        buttons={['OK']}
      /> 
      <IonAlert
        isOpen={timeError}
        onDidDismiss={() => setTimeError(false)}
        header={'Alert'}
        message={"Start time must be before end time"}
        buttons={['OK']}
      />          
      <IonPopover
        cssClass="popover"        
        isOpen={showPopover}
        onDidDismiss={() => setShowPopover(false)}
      >
        <IonText>Delete Party?</IonText><br/>
        <IonText class="white-text">You won't be able to recover this party</IonText><br/>
        <IonButton onClick={()=>setShowPopover(false)}>
          Cancel
        </IonButton>            
        <IonButton onClick={()=>deleteParty()}>
          Delete
        </IonButton>   
      </IonPopover>             
      </IonContent>
    )
  };

export default CreateParty;
