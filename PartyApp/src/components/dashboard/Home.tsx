import React, { Component } from 'react';
import {
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar,
  IonCol,
  IonRow,
  IonGrid,
} from '@ionic/react';
import { home, add, addCircle, logIn } from 'ionicons/icons';
import Notifications from './Notifications'
import PartyList from '../parties/PartyList'
import { connect } from 'react-redux'

class Home extends React.Component<IHomeProps, IHomeState> {
  render(){

    const { parties } = this.props;
    return(
      <IonPage>
        <IonToolbar>
          <IonTitle className="ion-text-center">Upcoming parties</IonTitle>
        </IonToolbar>
        <IonContent className="ion-padding">
        <IonGrid>
          <IonRow>
            <IonCol>
              <PartyList parties={parties}/>
            </IonCol>
            <IonCol>
              <Notifications />
            </IonCol>
          </IonRow>  
        </IonGrid>
        </IonContent>
      </IonPage>
    )
  }
}

interface IHomeProps {
  parties?: string[]
}
interface IHomeState {}

const mapStateToProps = (state) => {
  return{
    parties: state.party.parties
  }
}

export default connect(mapStateToProps)(Home)