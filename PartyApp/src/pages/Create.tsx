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
IonDatetime,
IonCheckbox, 
IonSearchbar, 
IonGrid,
IonRow,
IonCol
} from '@ionic/react';
import './Create.css';

const Create: React.FC = () => {
  
  const [text, setText] = useState<string>();
  const [showModal, setShowModal] = useState(false);

  const friendsList = [
  { val: 'Mark', isChecked: false },
  { val: 'Max', isChecked: false },
  { val: 'Harry', isChecked: false },
  { val: 'Harry', isChecked: false },
  { val: 'Harry', isChecked: false },
  { val: 'Harry', isChecked: false },
  { val: 'Harry', isChecked: false },
  { val: 'Harry', isChecked: false },
  ];

  const [checked, setChecked] = useState(false);
  const [searchText, setSearchText] = useState('');

  return (
    <IonPage className="ion-padding">
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
        <IonModal isOpen={showModal}>
          <IonHeader>
            <IonToolbar>
              <IonTitle className="ion-text-center">Select people to invite</IonTitle>
              <IonGrid>
                <IonRow>
                  <IonCol size="9">
                    <IonSearchbar value={searchText} onIonChange={e => setSearchText(e.detail.value!)} showCancelButton="focus" color="danger"></IonSearchbar>                  
                  </IonCol>
                  <IonCol>
                    <IonButton fill="clear" onClick={() => setShowModal(false)}>Done</IonButton>
                  </IonCol>                  
                </IonRow>
              </IonGrid>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              {friendsList.map(({ val, isChecked }, i) => (
                <IonItem key={i}>
                  <IonLabel>{val}</IonLabel>
                  <IonCheckbox slot="end" color="danger" value={val} checked={isChecked} />
                </IonItem>
              ))}
            </IonList>
          </IonContent>
        </IonModal>
        <IonButton expand="block" onClick={() => setShowModal(true)}>Invite People</IonButton>
        <IonButton expand="block" size="large">Create!</IonButton>
        </IonContent>
    </IonPage>
  );
};

export default Create;