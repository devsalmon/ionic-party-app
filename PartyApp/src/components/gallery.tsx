import React, { useState, useEffect } from 'react';
import {useCollection} from 'react-firebase-hooks/firestore';
import {
  IonIcon,
  IonCard,
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

const Gallery = ({id}) => {
    // party card
    const [host, setHost] = useState('');
    const [date, setDate] = useState('');
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [value, loading, error] = useCollection(
      firebase.firestore().collection('parties').doc(id).collection('pictures'),
    );  
    const doc = firebase.firestore().collection('parties').doc(id)
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

    // in the return function, we loop through each picture in the collection
    // and for each document, we create a picture card, 
    // passing through the document and doc.id to the picture function
    return(   
      <IonContent fullscreen={true}>
          <IonCard>
            <IonCardContent>
              <IonCardTitle>{title}</IonCardTitle>         
              <IonCardSubtitle>Hosted on {date} by {host}</IonCardSubtitle>   
              <IonCardSubtitle>{location}</IonCardSubtitle>              
            </IonCardContent>
          </IonCard>
          {value && value.docs.map(doc => {
            return( !loading &&
              <Picture doc={doc} id={id} key={id}/> 
            )
          })}         
      </IonContent>
    )
  } 

const Picture = ({doc, id}) => {

  // get pictures collection for the current party 
  const collectionRef = firebase.firestore().collection('parties').doc(id).collection('pictures'); 

  const [liked, setLiked] = useState(Boolean);
  const [numLikes, setNumLikes] = useState(Number); 

  useEffect(() => {  
    likedPicture()      
  },
  []);

  const likedPicture = () => {
    // set initial likes by fetching data from the picture document 
    collectionRef.doc(doc.id).get().then(function(doc){
      if (doc.data().likes.includes(firebase.auth().currentUser.displayName)) {
        setLiked(true); 
      } else {
        setLiked(false); 
      };
      setNumLikes(doc.data().likeCounter ? doc.data().likeCounter : 0);    
    });    
  }

  const like = () => {
    // like a picture
    collectionRef.doc(doc.id).get().then(function(doc){
      // update like counter in the picture document, and add current user to the likes array
      collectionRef.doc(doc.id).update({
        likes: firebase.firestore.FieldValue.arrayUnion(firebase.auth().currentUser.displayName),
        likeCounter:  firebase.firestore.FieldValue.increment(1)
      })             
    });
    setLiked(true); 
  }

  const unlike = () => {
    // like a picture
    collectionRef.doc(doc.id).get().then(function(doc){
      // update like counter in the picture document, and add current user to the likes array
      collectionRef.doc(doc.id).update({
        likes: firebase.firestore.FieldValue.arrayRemove(firebase.auth().currentUser.displayName),
        likeCounter:  firebase.firestore.FieldValue.increment(-1)
      })            
    });
    setLiked(false);     
  }

  collectionRef.doc(doc.id).onSnapshot(function(doc){
    setNumLikes(doc.data().likeCounter);
  })


  const likeButton = liked ? (
    <IonButton onClick={unlike} fill="clear" class="like-panel">
      <IonIcon icon={heart} />   
    </IonButton>       
  ) : (
    <IonButton onClick={like} fill="clear" class="like-panel">
      <IonIcon icon={heartOutline} />   
    </IonButton>     
  )

  return(
    <IonCard class="create-card">
      <IonCardHeader class="create-button">
        <IonCol pull="1">{doc.data().takenAt} </IonCol>
        <IonCol pull="1">{doc.data().takenBy}</IonCol>
        <IonCol push="1">{numLikes}</IonCol>
      </IonCardHeader>       
      <IonImg class="gallery-photo" src={doc.data().picture} />  
      {likeButton}        
    </IonCard>  
  )
}

export default Gallery;