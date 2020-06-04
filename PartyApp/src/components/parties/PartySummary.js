import React from 'react'
import {
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonCardSubtitle,
    IonList,
    IonAvatar,
    IonItemSliding,
    IonItemOption,
    IonItemOptions
}
from '@ionic/react'

const PartySummary = () => {
    return(
    <IonCard>
        <IonCardHeader>
        <IonCardSubtitle>Card Subtitle</IonCardSubtitle>
        <IonCardTitle>Card Title</IonCardTitle>
        </IonCardHeader>

        <IonCardContent>
        Keep close to Nature's heart... and break clear away, once in awhile,
        and climb a mountain or spend a week in the woods. Wash your spirit clean.
        </IonCardContent>
    </IonCard>
    )
}

export default PartySummary