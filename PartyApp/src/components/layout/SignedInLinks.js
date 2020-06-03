import React from 'react';
import { 
  IonMenu,
  IonPage,
  IonHeader, 
  IonContent, 
  IonToolbar, 
  IonTitle, 
  IonList, 
  IonItem, 
  IonRouterOutlet,
  IonApp, 
  IonMenuToggle,
  IonIcon,
  IonLabel,
  IonTabs,
  IonReactRouter
  } from '@ionic/react';
import { home, add, addCircle, logIn, triangle } from 'ionicons/icons';


const SignedInLinks = () => {
    return(
<IonReactRouter>
  <IonRouterOutlet>
    <Route path="/login" component={Login} exact />
    <Route path="/create" component={Create} exact />
    <Route path="/home" component={Home} />
    <Route path="/nickspage" component={Nick} />
    <Route path="/nickstestpage" component={Test} />
    <Route path="/" render={() => <Redirect to="/login"/>} exact={true} />
  </IonRouterOutlet>
  </IonReactRouter>
  )
  }

  export default SignedInLinks