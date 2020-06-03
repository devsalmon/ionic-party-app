import React, { useState, Component } from 'react';
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
IonCol,
IonTextarea
} from '@ionic/react';
import './Create.css';

class Create extends React.Component {

  state = {
    title : '',
    location: '',
    date: '',
    startTime: '',
    endTime: '',
    details: '',
    showModal : Boolean(false),
    checked : Boolean(false),
    searchText : '',
    friendsList : [
      { val: 'Mark', isChecked: false },
      { val: 'Max', isChecked: false },
      { val: 'Harry', isChecked: false },
      { val: 'Harry', isChecked: false },
      { val: 'Harry', isChecked: false },
      { val: 'Harry', isChecked: false },
      { val: 'Harry', isChecked: false },
      { val: 'Harry', isChecked: false },
    ],
  };
  render(){
    return(
    <IonPage className="ion-padding">
      <IonToolbar>
        <IonTitle className="ion-text-center">Create a party</IonTitle>
      </IonToolbar>
      <IonContent>
        <IonList>
          <IonItem>
            <IonInput value={this.state.title} placeholder="Title (e.g. Bruno's 17th)" clearInput></IonInput>
          </IonItem>

          <IonItem>
            <IonInput value={this.state.location} placeholder="Location" clearInput></IonInput>
          </IonItem>

          <IonItem>
            <IonLabel>Date</IonLabel>
            <IonDatetime value={this.state.date} placeholder="Select Date"></IonDatetime>
          </IonItem>

          <IonItem>
            <IonLabel>Time</IonLabel>
            <IonDatetime value={this.state.startTime} display-format="h:mm A" picker-format="h:mm A" placeholder="Select Time"></IonDatetime>
          </IonItem>
 
          <IonItem>
            <IonLabel>Ends</IonLabel>
            <IonDatetime value={this.state.endTime} display-format="h:mm A" picker-format="h:mm A" placeholder="Select Time"></IonDatetime>
          </IonItem>

          <IonItem>
            <IonTextarea value={this.state.details} placeholder="Additional Details"></IonTextarea>
          </IonItem>
        </IonList>
        <IonModal isOpen={this.state.showModal}>
          <IonHeader>
            <IonToolbar>
              <IonTitle className="ion-text-center">Select people to invite</IonTitle>
              <IonGrid>
                <IonRow>
                  <IonCol size="9">
                    <IonSearchbar value={this.state.searchText} onIonChange={e => this.setState({searchText:e.detail.value!})} showCancelButton="focus" color="danger"></IonSearchbar>                  
                  </IonCol>
                  <IonCol>
                    <IonButton fill="clear" onClick={e => this.setState({showModal:false})}>Done</IonButton>
                  </IonCol>                  
                </IonRow>
              </IonGrid>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              {this.state.friendsList.map(({ val, isChecked }, i) => (
                <IonItem key={i}>
                  <IonLabel>{val}</IonLabel>
                  <IonCheckbox slot="end" color="danger" value={val} checked={isChecked} />
                </IonItem>
              ))}
            </IonList>
          </IonContent>
        </IonModal>
        <IonButton expand="block" onClick={e => this.setState({showModal:true})}>Invite People</IonButton>
        <IonButton expand="block" size="large">Create!</IonButton>
        </IonContent>
    </IonPage>
    )
  }
};

export default Create;