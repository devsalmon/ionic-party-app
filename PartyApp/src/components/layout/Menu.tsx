import React from 'react';
import { 
  IonMenu,
  IonHeader, 
  IonContent, 
  IonToolbar, 
  IonTitle,
  IonRouterOutlet,
  IonButtons,
  IonButton,
  IonMenuToggle
  } from '@ionic/react';
import SignedInLinks from './SignedInLinks';
import SignedOutLinks from './SignedOutLinks';

class Menu extends React.Component{
  render() {
    return(
      <div>
      <IonMenuToggle>
        <IonMenu type="overlay" contentId="main" menuId="main-menu">
          <IonHeader>
            <IonToolbar color="primary">
              <IonTitle>Menu</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent color="primary">
            <SignedInLinks /> 
            <SignedOutLinks />  
          </IonContent>
        </IonMenu>
      </IonMenuToggle>
      <IonRouterOutlet id="main">
      </IonRouterOutlet>
      </div>
    );
  }  
}

export default Menu;