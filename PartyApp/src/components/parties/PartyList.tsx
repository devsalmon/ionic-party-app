import React from 'react'
import {
    IonList
}
from '@ionic/react'
import PartySummary from './PartySummary'

const PartyList = ({parties}) => {
    return(
    <IonList>
      { parties && parties.map(party =>{
        return(
          <PartySummary party={party} key={party.id}/>
        )
      })}
      
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