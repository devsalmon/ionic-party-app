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
    const [date, setDate] = useState<string>('')
    const [title, setTitle] = useState<string>('')
    const [location, setLocation] = useState<string>('')
    const [details, setDetails] = useState<string>('')
    const [endTime, setEndTime] = useState<string>('')
    const [startTime, setStartTime] = useState<string>('')  
    const [showModal, setShowModal] = useState(false);
    const [checked, setChecked] = useState(false);
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
            day: moment(date).format('D'), 
            month: moment(date).format('MMM'),
            details: details,
            endTime: moment(endTime).format('LLL'),
            startTime: moment(startTime).format('LLL'),
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
            <IonLabel color="warning">Date</IonLabel>
            <IonDatetime class="create-datetime" value={date} max="2050" min={moment(new Date()).format('YYYY')} onIonChange={e => setDate(e.detail.value!)} placeholder="select"></IonDatetime>
          </IonItem>
          <IonItem class="create-card" lines="none">
            <IonLabel color="warning">Starts</IonLabel>
            <IonDatetime class="create-datetime" value={startTime} onIonChange={e => setStartTime(e.detail.value!)} display-format="h:mm A" picker-format="h:mm A" placeholder="select"></IonDatetime>
          </IonItem>
          <IonItem class="create-card" lines="none">
            <IonLabel color="warning">Ends</IonLabel>
            <IonDatetime class="create-datetime" value={endTime} onIonChange={e => setEndTime(e.detail.value!)} display-format="h:mm A" picker-format="h:mm A" placeholder="select"></IonDatetime>
          </IonItem>
          <IonItem class="create-card" lines="none">
            <IonTextarea maxlength={150} class="create-input" value={details} onIonChange={e => setDetails(e.detail.value!)} placeholder="Additional details"></IonTextarea>
          </IonItem>
          <IonItem class="create-card" lines="none">
            <IonButton class="create-button" expand="block" onClick={e => setShowModal(true)}>Invite People</IonButton>
          </IonItem>        
          <IonButton class="create-button" expand="block" onClick={() => onSave()}>Create!</IonButton>        
      <br/><br/><br/><br/><br/><br/><br/>
      <IonModal isOpen={showModal}>
        <IonHeader>
          <IonToolbar>  
            <IonSearchbar class="searchbar" onIonChange={e => search(e.detail.value!)}></IonSearchbar>                            
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            {hits.map(hit => (
              <IonItem key={hit.objectID}>
                <IonLabel>{hit.name}</IonLabel>
                <IonCheckbox slot="end" color="danger" value={hit.name} checked={checked} />
              </IonItem>
            ))}
            <div className="ion-text-center">
              <IonButton class="custom-button" onClick={e => setShowModal(false)}>Done</IonButton>
            </div>
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

export default CreateParty;