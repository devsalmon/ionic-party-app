import React, { useState, useEffect} from 'react';
import { Redirect } from 'react-router-dom';
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
  IonRow,
  IonHeader, 
  IonContent, 
  IonToolbar, 
  IonTitle,
  IonAvatar,
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
  IonText
} from '@ionic/react';
import { 
  chevronBackSharp,  
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

const CreateParty = ({editingParty, backButton}) => {

    var currentuser = firebase.auth().currentUser;  

    useEffect(() => {
      firebase.firestore().collection("friends").doc(currentuser.uid).get().then(doc => {     
        if (doc.exists && doc.data().friends) {
          setFriends(doc.data().friends); // set state to have all current user's friends
        }
      })
    }, [])

    // function to hide tabs when in the create page
    function hideTab() {
      const tabBar = document.getElementById('appTabBar');
      tabBar.style.display = 'none';
    }
    // show tabs again when create page is exited
    function showTab() {       
      backButton() 
      const tabBar = document.getElementById('appTabBar');
      tabBar.style.display = 'flex';
    }        

    const [friends, setFriends] = useState([]); // list of people who can be searched for when inviting people
    const [invitedPeople, setInvitedPeople] = useState(editingParty ? editingParty.invited_people : []); // array of invited people
    const [title, setTitle] = useState<string>(editingParty ? editingParty.title : "");
    const [address, setAddress] = useState<string>(editingParty ? editingParty.address : "");
    const [postcode, setPostcode] = useState<string>(editingParty ? editingParty.postcode : "");
    const [details, setDetails] = useState<string>(editingParty ? editingParty.details : "");
    const [endTime, setEndTime] = useState<string>(editingParty ? editingParty.endTime : "");
    const [dateTime, setDateTime] = useState<string>(editingParty ? editingParty.dateTime : ""); 
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
      const inputsFilled = Boolean((title !== "") && (address !== "") && (postcode !== "") && (dateTime !== "") && (endTime !== ""));
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
                        myInvites: firebase.firestore.FieldValue.arrayUnion(editingParty.id),
                        inviteFrom: firebase.firestore.FieldValue.arrayUnion(host_user_id)
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
              setInvitedPeople([]);                               
              })  
            } else {
              console.log("creating")
            // only add documents to collection if forms are validated
              collectionRef.add({
                title: title, 
                address: address,
                postcode: postcode,
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
                      myInvites: firebase.firestore.FieldValue.arrayUnion(docRef.id),
                      inviteFrom: firebase.firestore.FieldValue.arrayUnion(host_user_id)
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
          myInvites: firebase.firestore.FieldValue.arrayRemove(editingParty.id),
          inviteFrom: firebase.firestore.FieldValue.arrayRemove(currentuser.uid),
          acceptedInvitesFrom: firebase.firestore.FieldValue.arrayRemove(currentuser.uid),
          acceptedInvites: firebase.firestore.FieldValue.arrayRemove(editingParty.id)
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
    return(
      <IonContent class="create-content" fullscreen={true}>
        {hideTab()} 
        <IonToolbar color="warning">
          <IonButtons slot="start" class="create-back-button">
            <IonButton  fill="clear" color="dark" onClick={()=>showTab()} href="/home">
              <IonIcon slot="icon-only" icon={chevronBackSharp}></IonIcon>
            </IonButton>
          </IonButtons>        
          {editingParty ? <IonTitle color="dark">Editing</IonTitle> : 
            <IonTitle color="dark">Create<br/>a party</IonTitle> 
          }  
        </IonToolbar>
          <IonItem class="rounded-top">
            <IonInput class="create-input" value={title} onIonChange={e => setTitle(e.detail.value!)} placeholder="Title" clearInput></IonInput>
          </IonItem>
          <IonItem class="create-card">   
            <IonInput class="create-input" value={address}  onIonChange={e => setAddress(e.detail.value!)} placeholder="Address" clearInput></IonInput>                               
          </IonItem>
          <IonItem class="create-card">   
            <IonInput class="create-input" value={postcode}  onIonChange={e => setPostcode(e.detail.value!)} placeholder="Postcode/Zipcode" clearInput></IonInput>                               
          </IonItem>
          {/* <IonItem class="create-card">
            <IonButton class="create-button" expand="block"  href='/googlemap'> See Map </IonButton>  
          </IonItem> */}
          <IonItem class="create-card">
            <IonLabel color="warning">Starts</IonLabel>
            <IonDatetime class="create-datetime" value={dateTime} onIonChange={e => setDateTime(e.detail.value!)} displayFormat="DD-MMM-YY HH:mm" placeholder="select"></IonDatetime>
          </IonItem>
          <IonItem class="create-card">
            <IonLabel color="warning">Ends</IonLabel>
            <IonDatetime class="create-datetime" value={endTime} onIonChange={e => setEndTime(e.detail.value!)} displayFormat="DD-MMM-YY HH:mm" placeholder="select"></IonDatetime>
          </IonItem>
          <IonItem class="create-card">
            <IonTextarea maxlength={150} class="create-input" value={details} onIonChange={e => setDetails(e.detail.value!)} placeholder="Additional details"></IonTextarea>
          </IonItem>
          <IonItem class="create-card">
            <IonButton class="create-button" expand="block" onClick={e => setShowPeopleSearch(true)}>Invite People</IonButton>
          </IonItem>       
          {invitedPeople && invitedPeople.map(person => {
            return(
              <IonItem class="create-card" key={person.id}>                
                <IonText>{person.username}</IonText>
                <IonButton slot="end" color="warning" onClick={() => removeInvite(person.id)}>Remove</IonButton>
              </IonItem>
            )
          })}  
          <IonItem class="rounded-bottom"> 
            <IonButton 
            class="create-button" 
            expand="block" 
            onClick={() => onSave()}>{editingParty ? "Update!" : "Create!"}</IonButton>        
          </IonItem><br/><br/>
          {editingParty ? 
            <IonButton color="danger" class="create-button" onClick={() => setShowPopover(true)}>Delete party</IonButton> :
          null}

          
      <br/><br/><br/><br/><br/><br/><br/>
      <IonModal isOpen={showPeopleSearch}>
        <IonHeader>
          <IonToolbar>  
            <IonSearchbar class="searchbar" onIonChange={e => search(e.detail.value!)} placeholder="Search Friends"></IonSearchbar>                            
          </IonToolbar>
        </IonHeader>
        <IonContent class="create-content ion-padding">
          {query.trim() !== "" && (/[a-zA-z]//*all letters */).test(query) && hits.map(hit => (
            hit.objectID === currentuser.uid || !friends.includes(hit.objectID) ? null :
              <IonRow key={hit.objectID}>
                <IonCol size="9">
                  <IonItem button class="create-input">    
                    <IonCol size="4">
                      <IonAvatar>
                        <img src={hit.photoURL ? hit.photoURL : "https://img.favpng.com/18/24/16/user-silhouette-png-favpng-4mEnHSRfJZD8p9eEBiRpA9GeS.jpg"} />
                      </IonAvatar>  
                    </IonCol>
                    <IonCol offset="1" size="7">
                      <IonText>{hit.username}</IonText>   
                    </IonCol>
                  </IonItem>
                </IonCol>                            
                <IonCol size="3">
                  <IonButton color="dark" onClick={() => addInvite(hit.objectID, hit.username)}>Invite</IonButton>
                </IonCol>
              </IonRow>
          ))}<br/>          
          <IonItem class="create-card">
            <IonText>People invited: </IonText>
          </IonItem>
          {invitedPeople && invitedPeople.map(person => {
            return(
              <IonItem class="create-card" key={person.id}>                
                <IonText>{person.username}</IonText>
                <IonButton slot="end" color="warning" onClick={() => removeInvite(person.id)}>Remove</IonButton>
              </IonItem>
            )
          })}                    
        </IonContent>
        <IonFooter>
          <IonButton class="custom-button" onClick={e => setShowPeopleSearch(false)}>Add People</IonButton>
        </IonFooter>        
      </IonModal>    
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        duration={2000}
        message="Party Created!"
        position="bottom"
      />
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
