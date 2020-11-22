import React, { useState } from 'react';
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
              <Picture doc={doc} id={id}/> 
            )
          })}         
      </IonContent>
    )
  } 

const Picture = ({doc, id}) => {
  const [liked, setLiked] = useState(false); 

  // get pictures collection for the current party 
  const collectionRef = firebase.firestore().collection('parties').doc(id).collection('pictures'); 

  // function to like pictures
  const like = () => {
    // get the picture that was liked or unliked 
      collectionRef.doc(doc.id).get().then(function(doc){
      // if the picture wasn't liked in the first place
      if (liked === false) {
        setLiked(true);         
        // update like counter in the picture document, and add current user to the likes array
        collectionRef.doc(doc.id).update({
          likes: firebase.firestore.FieldValue.arrayUnion(firebase.auth().currentUser.displayName),
          likeCounter:  firebase.firestore.FieldValue.increment(1)
        })
      }
      else {
        // if the picture was already liked by the current user then unlike it
        setLiked(false);
        // decrement like counter and remove user from array
        collectionRef.doc(doc.id).update({
          likes: firebase.firestore.FieldValue.arrayRemove(firebase.auth().currentUser.displayName),
          likeCounter: firebase.firestore.FieldValue.increment(-1)
        })       
      };       
    })
  }

  return(
    <IonCard class="create-card">
      <IonCardHeader class="create-button">{doc.data().takenBy}</IonCardHeader>       
      <IonImg class="gallery-photo" src={doc.data().picture} />  
      <IonButton onClick={like} fill="clear" class="like-panel">
        <IonIcon icon={liked ? heart : heartOutline} />   
      </IonButton>         
      <p className="slide-text">{doc.data().takenAt}</p>   
    </IonCard>  
  )
}

export default Gallery;