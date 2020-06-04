import React from 'react'
import {
    IonList
}
from '@ionic/react'
import PartySummary from './PartySummary'

const PartyList = () => {
    return(
    <IonList>
        <PartySummary />
        <PartySummary />
        <PartySummary />
        
        {/* {arr.map(elem => (
            <IonItemSliding key = {elem.name}> 
              <IonItem>
                <IonAvatar>
                  <img src={'https://ionicframework.com/docs/demos/api/list/avatar-finn.png'} />
                </IonAvatar>
                <IonLabel className="ion-padding">
                  <h2>{elem.name}</h2>
                </IonLabel>
              </IonItem>
              <IonItemOptions side="end">
                <IonItemOption>See details</IonItemOption>
              </IonItemOptions> 
            </IonItemSliding> 
          ))}*/}
    </IonList>
    )
}

export default PartyList