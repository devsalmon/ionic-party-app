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
import { createParty } from '../../store/actions/partyActions'
import { connect } from 'react-redux'

class Create extends React.Component<ICreateProps, ICreateState> {

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
  }

  handleChange = (e) => {
      this.setState({
          [e.target.id]: e.target.value
      })
  }
  handleSubmit = (e) => {
      e.preventDefault()
      this.props.createParty(this.state)
  }
  render(){
    return(
    <IonPage className="ion-padding">
      <IonToolbar>
        <IonTitle className="ion-text-center">Create a party</IonTitle>
      </IonToolbar>
      <IonContent>
        <IonList>
          <IonItem>
            <IonInput id="title" onIonChange={this.handleChange} placeholder="Title (e.g. Bruno's 17th)" clearInput></IonInput>
          </IonItem>

          <IonItem>
            <IonInput id="location" onIonChange={this.handleChange} placeholder="Location" clearInput></IonInput>
          </IonItem>

          <IonItem>
            <IonLabel>Date</IonLabel>
            <IonDatetime id="date" onIonChange={this.handleChange} placeholder="Select Date"></IonDatetime>
          </IonItem>

          <IonItem>
            <IonLabel>Time</IonLabel>
            <IonDatetime id="startTime" onIonChange={this.handleChange} display-format="h:mm A" picker-format="h:mm A" placeholder="Select Time"></IonDatetime>
          </IonItem>
 
          <IonItem>
            <IonLabel>Ends</IonLabel>
            <IonDatetime id="endTime" onIonChange={this.handleChange} display-format="h:mm A" picker-format="h:mm A" placeholder="Select Time"></IonDatetime>
          </IonItem>

          <IonItem>
            <IonTextarea id="details" onIonChange={this.handleChange} placeholder="Additional Details"></IonTextarea>
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
        <IonButton onClick={this.handleSubmit} expand="block" size="large">Create!</IonButton>
        </IonContent>
    </IonPage>
    )
  }
};

interface ICreateProps {
  createParty: (string) => string[]
}
interface ICreateState {}

const mapDispatchToProps = (dispatch) => {
  return{
    createParty: (party) => dispatch(createParty(party))
  }
}

export default connect(null, mapDispatchToProps)(Create);