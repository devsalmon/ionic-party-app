import React, { useState } from 'react';
import { 
IonContent, 
IonHeader, 
IonPage, 
IonTitle, 
IonToolbar, 
IonButton, 
IonButtons,
IonItemDivider, 
IonInput, 
IonModal, 
IonItem, 
IonList, 
IonLabel, 
IonDatetime 
} from '@ionic/react';
import './Create.css';

const Create: React.FC = () => {
  
  const [text, setText] = useState<string>();
  const [showModal, setShowModal] = useState(false);
  return (
    <IonPage>
      <IonToolbar>
        <IonTitle className="ion-text-center">Create a party</IonTitle>
      </IonToolbar>
      <IonContent>
        <IonList>
          <IonItem>
            <IonInput value={text} placeholder="Title (e.g. Bruno's 17th)" clearInput></IonInput>
          </IonItem>

          <IonItem>
            <IonInput value={text} placeholder="Location" clearInput></IonInput>
          </IonItem>

          <IonItem>
            <IonLabel>Date</IonLabel>
            <IonDatetime placeholder="Select Date"></IonDatetime>
          </IonItem>

          <IonItem>
            <IonLabel>Time</IonLabel>
            <IonDatetime display-format="h:mm A" picker-format="h:mm A" placeholder="Select Time"></IonDatetime>
          </IonItem>
 
          <IonItem>
            <IonLabel>Ends</IonLabel>
            <IonDatetime display-format="h:mm A" picker-format="h:mm A" placeholder="Select Time"></IonDatetime>
          </IonItem>
        </IonList>
        <IonModal isOpen={showModal} cssClass='my-custom-class'>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Select people to invite</IonTitle>
              <IonButtons slot="end">
              <IonButton onClick={() => setShowModal(false)}>Done</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              <IonItem>
                Test
              </IonItem>
            </IonList>
          </IonContent>
        </IonModal>
        <IonButton expand="block" onClick={() => setShowModal(true)}>Invite People</IonButton>
        </IonContent>
    </IonPage>
  );
};

export default Create;