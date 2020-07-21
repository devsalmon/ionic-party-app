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
  IonBackButton, 
} from '@ionic/react';
import { 
  chevronBackSharp
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

const Gallery = ({id, click}) => {
    // party card
    const [value, loading, error] = useCollection(
      firebase.firestore().collection('parties').doc(id).collection('pictures'),
    );  
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
      <IonGrid>
        <IonRow>
          <IonButton onClick={click}>
            <IonIcon icon={chevronBackSharp} />
          </IonButton>     
        </IonRow>
          <IonSlides scrollbar={false} pager={true} options={{initialSlide: 1, preloadImages: true, loop: true}}>
            {value && value.docs.map(doc => {
              return(                        
                <IonSlide key={doc.id}>
                  <IonRow>
                    <IonImg src={doc.data().picture} />
                  </IonRow>     
                  <IonRow className="ion-padding">
                    <IonLabel>Taken at {doc.data().createdAt}</IonLabel>
                  </IonRow>   
                </IonSlide>
              )
            })}      
          </IonSlides>  
      </IonGrid>
    )
  } 

export default Gallery;