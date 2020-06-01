import React, { useState } from 'react';
import { 
IonContent, 
IonHeader, 
IonPage, 
IonTitle, 
IonToolbar, 
IonButton, 
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
          <p>This is modal content</p>
          <IonButton onClick={() => setShowModal(false)}>Close Modal</IonButton>
        </IonModal>
        <IonButton expand="block" onClick={() => setShowModal(true)}>Invite People</IonButton>
        </IonContent>
    </IonPage>
  );
};

export default Create;