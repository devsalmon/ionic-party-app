import React, { useState, useEffect} from 'react';
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

const CreateParty = ({initialValue, clear}) => {

  // function to hide tabs when in the create page
  function hideTab() {
    const tabBar = document.getElementById('appTabBar');
    tabBar.style.display = 'none';
  }
  // show tabs again when create page is exited
  function showTab() {        
    const tabBar = document.getElementById('appTabBar');
    tabBar.style.display = 'flex';
  }    

  const [invitedPeople, setInvitedPeople] = useState([]); // array of invited people
  const [title, setTitle] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [postcode, setPostcode] = useState<string>('');
  const [details, setDetails] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [dateTime, setDateTime] = useState<string>('');  
  const [showPeopleSearch, setShowPeopleSearch] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [timeError, setTimeError] = useState(false);
  const [refresh, setRefresh] = useState(false);

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
      const inputsFilled = Boolean((title !== "") && (address !== "") && (postcode !== "") && (dateTime !== "") && (endTime !== "") && (invitedPeople.length > 0));
      const timesValid = Boolean(moment(endTime).isAfter(dateTime));
      
      if (inputsFilled === false) {
        setShowAlert(true)  
        setTimeError(false);
      } else if (timesValid === false) {
        setTimeError(true);
      } else if (inputsFilled === true && timesValid === true) {
        setTimeError(false);        
        let collectionRef = firebase.firestore().collection("users").doc(currentuser.uid).collection("myParties");
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
            })          
          //clear fields
          setTitle("");
          setAddress("");
          setPostcode("");
          setDetails("");
          setEndTime("");
          setDateTime("");
          setInvitedPeople([]);
          clear();        
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

    var currentuser = firebase.auth().currentUser;

    return(
      <IonContent class="create-content" fullscreen={true}>
        {hideTab()} 
        <IonToolbar color="warning">
          <IonButtons slot="start">
            <IonButton  fill="clear" color="dark" onClick={()=>showTab()} href="/home">
              <IonIcon slot="icon-only" icon={chevronBackSharp}></IonIcon>
            </IonButton>
          </IonButtons>        
          <IonTitle className="ion-text-center" color="dark">Create <br/>a party</IonTitle>  
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
          {/* <IonItem class="create-card" lines="none">
            <IonButton class="create-button" expand="block"  href='/googlemap'> See Map </IonButton>  
          </IonItem> */}
          <IonItem class="create-card" lines="none">
            <IonLabel color="warning">Starts</IonLabel>
            <IonDatetime class="create-datetime" value={dateTime} onIonChange={e => setDateTime(e.detail.value!)} displayFormat="DD-MMM-YY HH:mm" placeholder="select"></IonDatetime>
          </IonItem>
          <IonItem class="create-card" lines="none">
            <IonLabel color="warning">Ends</IonLabel>
            <IonDatetime class="create-datetime" value={endTime} onIonChange={e => setEndTime(e.detail.value!)} displayFormat="DD-MMM-YY HH:mm" placeholder="select"></IonDatetime>
          </IonItem>
          <IonItem class="create-card" lines="none">
            <IonTextarea maxlength={150} class="create-input" value={details} onIonChange={e => setDetails(e.detail.value!)} placeholder="Additional details"></IonTextarea>
          </IonItem>
          <IonItem class="create-card" lines="none">
            <IonButton class="create-button" expand="block" onClick={e => setShowPeopleSearch(true)}>Invite People</IonButton>
          </IonItem>       
          <IonItem class="rounded-bottom" lines="none"> 
            <IonButton class="create-button" expand="block" onClick={() => onSave()}>Create!</IonButton>        
          </IonItem>
      <br/><br/><br/><br/><br/><br/><br/>
      <IonModal isOpen={showPeopleSearch}>
        <IonHeader>
          <IonToolbar>  
            <IonSearchbar class="searchbar" onIonChange={e => search(e.detail.value!)}></IonSearchbar>                            
          </IonToolbar>
        </IonHeader>
        <IonContent class="create-content ion-padding">
          {query.trim() !== "" && (/[a-zA-z]//*all letters */).test(query) && hits.map(hit => (
            hit.objectID === currentuser.uid ? null :
              <IonRow key={hit.objectID}>
                <IonCol size="9">
                  <IonItem button class="create-input" lines="none">    
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
          <IonButton class="custom-button" onClick={e => setShowPeopleSearch(false)}>DONE</IonButton>
        </IonFooter>        
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
        message={invitedPeople.length == 0 ? "Invite some friends!" : /*if there aren't any invited people*/
          timeError ? "Start time should be before end time" : /*if the end time is before the start time*/
          "One or more input fields missing" /*otherwise, input fields must be missing*/
        }
        buttons={['OK']}
      />    
      </IonContent>
    )
  };

export default CreateParty;
