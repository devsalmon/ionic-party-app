import React, { useState } from 'react';
import { 
IonContent, 
IonHeader, 
IonPage, 
IonTitle, 
IonToolbar, 
IonButton, 
IonButtons,
IonInput, 
IonItem, 
IonList, 
IonLabel, 
IonSearchbar, 
IonGrid,
IonRow,
IonCol,
} from '@ionic/react';

const Memories: React.FC = () => {
    return(
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle className="ion-text-center">Memories</IonTitle>
                </IonToolbar>
            </IonHeader>
        </IonPage>
    );
};

export default Memories;