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
  IonCol,
  IonInput,
  IonText,
  IonItem,
  IonTextarea,
  IonPopover,
  IonTitle
} from '@ionic/react';
import {   
  heartOutline,
  heart,
  sendOutline,
  trashBinSharp
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
    const [message, setMessage] = useState('');
    const [afterMessage, setAfterMessage] = useState('');
    const [edit, setEdit] = useState(false);

    const [value, loading, error] = useCollection(
      firebase.firestore().collection('users').doc(hostid).collection('myParties').doc(partyid).collection('pictures'),
    );      

    useEffect(() => {
      firebase.firestore().collection("users").doc(hostid).get().then(doc => {
        setHost(doc.data().username)
      })
    })

    const doc = firebase.firestore().collection('users').doc(hostid).collection("myParties").doc(partyid)
    doc.get().then(function(doc) {
      if (doc.exists) {
          setTitle(doc.data().title);
          setLocation(doc.data().location);
          setDate(moment(doc.data().date).format('l'));
          setAfterMessage(doc.data().afterMessage)
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });

      const uploadMessage = () => {
        doc.update({
          afterMessage: message
        }).then(function(doc){
          setEdit(false);
        })
      }

    // in the return function, we loop through each picture in the collection
    // and for each document, we create a picture card, 
    // passing through the document and doc.id to the picture function
    return(   
      <IonContent fullscreen={true}>
          <IonCard class="gallery-card">
            <IonCardHeader>
              <IonCardTitle>{title}</IonCardTitle><br/>         
              <IonCardSubtitle>Hosted on {date} by {host}</IonCardSubtitle>            
            </IonCardHeader>
            <IonCardContent>
              {firebase.auth().currentUser.uid === hostid && edit ?              
                <IonItem>
                  <IonTextarea class="create-input" value={message} placeholder="Message" onIonChange={e => setMessage(e.detail.value!)}></IonTextarea>
                  <IonButton onClick={() => uploadMessage()}>Upload</IonButton>
                </IonItem>
             : null
            }         
            {afterMessage === '' ? <IonText>"Thanks for coming!"</IonText> : <IonText>"{afterMessage}"</IonText>}
            {firebase.auth().currentUser.uid === hostid && !edit ?              
              <IonItem lines="none">
                <IonButton onClick={() => setEdit(true)}>Edit</IonButton>
              </IonItem>
             : null
            }                  
            </IonCardContent>
          </IonCard>
          {value && value.docs.map((doc, i) => {
            return( !loading &&
              <Picture doc={doc} hostid={hostid} partyid={partyid} key={i}/> 
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
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [otherComments, setOtherComments] = useState([]);
  const [displayName, setDisplayName] = useState('');
  const [takenBy, setTakenBy] = useState('');
  const [deletePhotoPopover, setDeletePhotoPopover] = useState(false);
    
  var currentuser = firebase.auth().currentUser.uid

  useEffect(() => {  
    firebase.firestore().collection("users").doc(currentuser).get().then(doc => {
      setDisplayName(doc.data().username)
    })    
    firebase.firestore().collection("users").doc(doc.data().takenByID).get().then(doc => {
      setTakenBy(doc.data().username)
    })        
    likedPicture();
    checkOwnPicture();
    displayComments();
  }, [refresh]);

  const checkOwnPicture = () => {
    // function to check if the picture was taken by the current user
    collectionRef.doc(doc.id).get().then(function(doc){
      // if picture was taken by the current user then they can delete it 
      if (doc.data().takenByID === firebase.auth().currentUser.uid) {
        setOwnPicture(true)
      } else {
        setOwnPicture(false)
      } 
    })       
  }

  const likedPicture = () => {
    // set initial likes by fetching data from the picture document 
    collectionRef.doc(doc.id).get().then(function(doc){
      if (doc.data().likes.includes(currentuser)) {
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
        likes: firebase.firestore.FieldValue.arrayUnion(currentuser),
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
        likes: firebase.firestore.FieldValue.arrayRemove(currentuser),
        likeCounter:  firebase.firestore.FieldValue.increment(-1)
      })            
    });
    setLiked(false);     
  }

  collectionRef.doc(doc.id).onSnapshot(function(doc){
    // update like counter on the picture when there's an update in the picture document 
    doc.data() && setNumLikes(doc.data().likeCounter);    
    //doc.data() && displayComments();
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
    <IonButton onClick={() => setDeletePhotoPopover(true)} fill="clear" color="warning">
      Remove
    </IonButton>
  ) : null 

  const writeComments = () => {
    if (comment != '') {
    collectionRef.doc(doc.id).collection("Comments").add({
      username: displayName,
      comment: comment,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      pictureOwner: doc.data().takenByID
    }).then(function(docRef) {
        setComment('');
        displayComments(); 
        setShowComments(true);       
        })
    }
  }

  const deleteComment = (id) => {
    collectionRef.doc(doc.id).collection("Comments").doc(id).delete().then(function() {
        displayComments(); 
      })
  }  

  const displayComments = () => {
    setOtherComments([])
    collectionRef.doc(doc.id).collection("Comments").orderBy("timestamp", "asc").get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        var commentor = doc.data().username
        var theComment = doc.data().comment
          setOtherComments(otherComments => [
            ...otherComments, 
            {
              name: commentor,
              comment: theComment,
              id: doc.id
            }              
          ]);
        })
      })
      }

  return(
    <IonCard class="picture-card">
      <IonCardHeader>
        <IonRow>
        <IonCol><IonText>{doc.data().takenAt}</IonText></IonCol> 
        <IonCol size="5"><IonText>{takenBy}</IonText></IonCol> 
        <IonCol><IonText>{numLikes} likes</IonText></IonCol> 
        </IonRow>
      </IonCardHeader>       
      <IonImg class="gallery-photo" src={doc.data().picture} />  
      <IonRow>
        {likeButton}    
        {removePicture}
        {showComments ? 
        <IonButton onClick={()=>setShowComments(false)} fill="clear" color="warning">
          Hide comments
        </IonButton>    
        :
        <IonButton onClick={()=>setShowComments(true)} fill="clear" color="warning">
          See comments
        </IonButton>}
      </IonRow>
      {otherComments && showComments && otherComments.map((comment, i) => {
          return(
            <>
            <IonText class="ion-padding-start">{comment.name}: {comment.comment}</IonText>
            <IonButton class="yellow-text" onClick={()=>deleteComment(comment.id)}>
              <IonIcon icon={trashBinSharp} />
            </IonButton><br/>
            </>            
          )
      })}
      <IonRow>
      <IonInput 
        class="create-input ion-padding-start" 
        value={comment} 
        placeholder="Comment"
        type="text"
        onIonChange={e => setComment(e.detail.value!)}>
        {comment ? /*only show send button when there is text in the comment area */
        <IonButton onClick={writeComments}>
        <IonIcon slot="icon-only" icon={sendOutline} />
        </IonButton> : null} 
      </IonInput>  
      </IonRow>
      <IonPopover
        cssClass="popover"        
        isOpen={deletePhotoPopover}
        onDidDismiss={() => setDeletePhotoPopover(false)}
      >      
      <IonText>Delete this photo?</IonText><br/>
      <IonButton class="yellow-text" onClick={() => deletePicture()}>YES</IonButton>
      <IonButton class="yellow-text" onClick={() => setDeletePhotoPopover(false)}>No</IonButton>
      </IonPopover>
    </IonCard>  
  )
}

export default Gallery;