import React, { useState, useEffect} from 'react';
import {useCollection} from 'react-firebase-hooks/firestore';
import {
  IonIcon,
  IonLabel,
  IonItem,
  IonList, 
  IonButton,
  IonHeader, 
  IonContent, 
  IonToolbar, 
  IonTitle,
  IonRow,
  IonCol,
  IonGrid,
  IonText,
  IonImg,
  IonSlides,
  IonSlide,
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
    const [liked, setLiked] = useState(false); 
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
          setDate(doc.data().date);
          setHost(doc.data().host);
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });

    const like = () => {
      if (liked == false) {
        setLiked(true); 
      } else {
        setLiked(false); 
      };      
    }

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
      <IonContent fullscreen={true}>
        <IonSlides class="accordion-item" scrollbar={false} pager={true} options={{initialSlide: 0, preloadImages: false, loop: true}}>
          {value && value.docs.map(doc => {
            return( !loading && 
              <IonSlide key={doc.id}>
                <IonImg class="gallery-photo" src={doc.data().picture} />
                <IonButton onClick={like} fill="clear" size="large" class="like-panel">
                  <IonIcon icon={liked ? heart : heartOutline} />                  
                </IonButton>         
                <p className="slide-text">{doc.data().createdAt}</p>
              </IonSlide>
            )
          })}      
        </IonSlides>  
        <IonItem>
          <IonGrid>
            <IonRow>
              <IonText>{title}</IonText>
            </IonRow>
            <IonRow>
              <IonText class="white-text">{location}</IonText>
            </IonRow>
            <IonRow>
              <IonText class="white-text">Hosted {date} by {host}</IonText>
            </IonRow>
          </IonGrid>
        </IonItem>
      </IonContent>
    )
  } 

export default Gallery;