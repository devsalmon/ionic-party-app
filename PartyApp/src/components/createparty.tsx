import React, { useState, useEffect} from 'react';
import {useDocument} from 'react-firebase-hooks/firestore';
import {
  IonLabel,
  IonItem,
  IonButton,
  IonHeader, 
  IonContent, 
  IonToolbar, 
  IonButtons, 
  IonTitle,
  IonSearchbar,
  IonInput,
  IonModal, 
  IonDatetime,
  IonCheckbox,
  IonTextarea,
  IonText,
  IonToast,
  IonPopover,
  IonAlert,
} from '@ionic/react';
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

    useEffect(() => {  
    },
    []);
    
    const [invitedPeople, setInvitedPeople] = useState([]); // array of invited people
    const [title, setTitle] = useState<string>('');
    const [location, setLocation] = useState<string>('');
    const [details, setDetails] = useState<string>('');
    const [endTime, setEndTime] = useState<string>('');
    const [dateTime, setDateTime] = useState<string>('');  
    const [showModal, setShowModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [value, loading, error] = useDocument(
      firebase.firestore().doc("parties/" + initialValue)
    );
  
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
      const valid = Boolean((title !== "") && (location !== "") && (dateTime !== "") && (endTime !== "") && (details !== ""));
      
      if (valid === false) {
        setShowAlert(true)    
      } else if (valid === true) {
        setShowToast(valid);
        let collectionRef = firebase.firestore().collection("parties");
        // only add documents to collection if forms are validated
          collectionRef.add(
            {title: title, 
            location: location, 
            date: moment(dateTime).format('LL'), 
            day: moment(dateTime).format('D'), 
            month: moment(dateTime).format('MMM'),
            details: details,
            endTime: moment(endTime).format('LLL'),
            dateTime: moment(dateTime).format('LLL'),
            host: firebase.auth().currentUser.displayName,
            invited_people: invitedPeople,             
            // use state for invited people - when checkbox clicked in invite people add that id to the state array
            createdOn: moment(new Date()).format('LL'), 
            }).then(function(docRef) {
              invitedPeople && invitedPeople.map(person => {
                firebase.firestore().collection("users").doc(person.id).update({
                  // add party id to user documents
                  myParties: firebase.firestore.FieldValue.arrayUnion(docRef.id)
                }).catch(function(error) {
                  console.error("error adding party id to user document", error);
                })           
              })              
            })
            //clear fields
            setTitle("");
            setLocation("");
            setDetails("");
            setEndTime("");
            setDateTime("");
            clear();        
      } 
    
    } 


    const addInvite = (id, name) => {
      setInvitedPeople(invitedPeople => [
        ...invitedPeople, 
        {              
          name: name,
          id: id
        }
      ]);
    }

    return(
      <IonContent class="create-content">
        <IonToolbar color="warning">
          <IonTitle color="dark">Create a party</IonTitle>  
        </IonToolbar>
          <IonItem class="create-card" lines="none">
            <IonInput class="create-input" value={title} onIonChange={e => setTitle(e.detail.value!)} placeholder="Title" clearInput></IonInput>
          </IonItem>
          <IonItem class="create-card" lines="none">
            <IonInput class="create-input" value={location} onIonChange={e => setLocation(e.detail.value!)} placeholder="Location" clearInput></IonInput>
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
            <IonTextarea maxlength={150} class="create-input" value={details} onIonChange={e => setDetails(e.detail.value!)} placeholder="Additional details"></IonTextarea>
          </IonItem>
          <IonItem class="create-card" lines="none">
            <IonButton class="create-button" expand="block" onClick={e => setShowModal(true)}>Invite People</IonButton>
          </IonItem>       
          <IonItem class="create-card" lines="none"> 
            <IonButton class="create-button" expand="block" onClick={() => onSave()}>Create!</IonButton>        
          </IonItem>
      <br/><br/><br/><br/><br/><br/><br/>
      <IonModal isOpen={showModal}>
        <IonHeader>
          <IonToolbar>  
            <IonSearchbar class="searchbar" onIonChange={e => search(e.detail.value!)}></IonSearchbar>                            
          </IonToolbar>
        </IonHeader>
        <IonContent class="create-content">
            {query.trim() !== "" && (/[a-zA-z]//*all letters */).test(query) && hits.map(hit => (
              <IonItem class="create-input" lines="none" key={hit.objectID}>
                <IonLabel>{hit.name}</IonLabel>
                <IonButton slot="end" color="danger" onClick={() => addInvite(hit.objectID, hit.name)}>Invite</IonButton>
              </IonItem>
            ))}
            <div className="ion-text-center">
              <IonButton class="custom-button" onClick={e => setShowModal(false)}>Done</IonButton>
            </div> 
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

export default CreateParty;