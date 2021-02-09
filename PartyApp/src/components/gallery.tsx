import React, { useState, useEffect } from 'react';
import {useCollection} from 'react-firebase-hooks/firestore';
import {
  IonIcon,
  IonCard,
  IonRow,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonCardSubtitle,
  IonButton,
  IonContent,
  IonImg,
  IonCol
} from '@ionic/react';
import {   
  heartOutline,
  heart
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

const Gallery = ({hostid, partyid}) => {
    // party card
    const [host, setHost] = useState('');
    const [date, setDate] = useState('');
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [value, loading, error] = useCollection(
      firebase.firestore().collection('users').doc(hostid).collection('myParties').doc(partyid).collection('pictures'),
    );  
    const doc = firebase.firestore().collection('users').doc(hostid).collection("myParties").doc(partyid)
    doc.get().then(function(doc) {
      if (doc.exists) {
          setTitle(doc.data().title);
          setLocation(doc.data().location);
          setDate(moment(doc.data().date).format('l'));
          setHost(doc.data().host);
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });

    // in the return function, we loop through each picture in the collection
    // and for each document, we create a picture card, 
    // passing through the document and doc.id to the picture function
    return(   
      <IonContent fullscreen={true}>
          <IonCard class="gallery-card">
            <IonCardContent class="gallery-card-content">
              <IonCardTitle class="gallery-card-title">{title}</IonCardTitle>         
              <IonCardSubtitle class="gallery-card-subtitle">Hosted on {date} by {host}</IonCardSubtitle>   
              <IonCardSubtitle class="gallery-card-subtitle">{location}</IonCardSubtitle>              
            </IonCardContent>
          </IonCard>
          {value && value.docs.map(doc => {
            return( !loading &&
              <Picture doc={doc} hostid={hostid} partyid={partyid} key={partyid}/> 
            )
          })}         
      </IonContent>
    )
  } 

const Picture = ({doc, hostid, partyid}) => {

  // get pictures collection for the current party 
  const collectionRef = firebase.firestore().collection('users').doc(hostid).collection('myParties').doc(partyid).collection("pictures"); 

  const [liked, setLiked] = useState(Boolean);
  const [numLikes, setNumLikes] = useState(Number); 
  const [ownPicture, setOwnPicture] = useState(Boolean);

  useEffect(() => {  
    likedPicture();
    checkOwnPicture();
  },
  []);

  const checkOwnPicture = () => {
    // function to check if the picture was taken by the current user
    collectionRef.doc(doc.id).get().then(function(doc){
      // if picture was taken by the current user then they can delete it 
      if (doc.data().takenBy === firebase.auth().currentUser.displayName) {
        setOwnPicture(true)
      } else {
        setOwnPicture(false)
      } 
    })       
  }

  const likedPicture = () => {
    // set initial likes by fetching data from the picture document 
    collectionRef.doc(doc.id).get().then(function(doc){
      if (doc.data().likes.includes(firebase.auth().currentUser.displayName)) {
        // if picture's likes array contains current user, the picture is already liked
        setLiked(true); 
      } else {
        // otherwise, the picture has not been liked by current user
        setLiked(false); 
      };
      // set number of likes to the picture document's like counter
      setNumLikes(doc.data().likeCounter ? doc.data().likeCounter : 0);    
    });    
  }

  const like = () => {
    // function to like a picture
    collectionRef.doc(doc.id).get().then(function(doc){
      // increase like counter in the picture document, and add current user to the likes array
      collectionRef.doc(doc.id).update({
        likes: firebase.firestore.FieldValue.arrayUnion(firebase.auth().currentUser.displayName),
        likeCounter:  firebase.firestore.FieldValue.increment(1)
      })             
    });
    setLiked(true); 
  }

  const unlike = () => {
    // function to unlike a picture
    collectionRef.doc(doc.id).get().then(function(doc){
      // decrease like counter in the picture document, and remove current user to the likes array
      collectionRef.doc(doc.id).update({
        likes: firebase.firestore.FieldValue.arrayRemove(firebase.auth().currentUser.displayName),
        likeCounter:  firebase.firestore.FieldValue.increment(-1)
      })            
    });
    setLiked(false);     
  }

  collectionRef.doc(doc.id).onSnapshot(function(doc){
    // update like counter on the picture when there's an update in the picture document 
    doc.data() && setNumLikes(doc.data().likeCounter);
  })

  const deletePicture = () => {
    // function to delete a picture
    collectionRef.doc(doc.id).delete()
    .catch(function(error) { 
      console.error("Error removing document: ", error); 
    });     
  }

  // display appropriate like button depending on whether photo has been liked or not (either filled or unfilled heart)
  const likeButton = liked ? (
    <IonButton onClick={unlike} class="like-panel">
      <IonIcon slot="icon-only" icon={heart} />   
    </IonButton>       
  ) : (
    <IonButton onClick={like} class="like-panel">
      <IonIcon slot="icon-only" icon={heartOutline} />   
    </IonButton>     
  )

  const removePicture = ownPicture ? (
    <IonButton onClick={deletePicture} fill="clear" color="warning">
      Remove
    </IonButton>
  ) : null 

  return(
    <IonCard class="picture-card">
      <IonCardHeader>
        <IonRow>
        <IonCol>{doc.data().takenAt}</IonCol> 
        <IonCol size="5">{doc.data().takenBy}</IonCol> 
        <IonCol>{numLikes} likes</IonCol> 
        </IonRow>
      </IonCardHeader>       
      <IonImg class="gallery-photo" src={doc.data().picture} />  
      <IonRow>
        {likeButton}    
        {removePicture}    
      </IonRow>
      <IonRow>
      comments...
      </IonRow>
    </IonCard>  
  )
}

export default Gallery;