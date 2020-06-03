import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs, 
  IonTab,
  IonText, 
  IonItem,
  IonList, 
  IonButton,
  IonPage,
  IonHeader, 
  IonContent, 
  IonToolbar, 
  IonButtons, 
  IonMenuButton,
  IonBackButton,
  IonTitle,
  IonSplitPane
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { home, add, addCircle, logIn } from 'ionicons/icons';
import Create from './pages/Create';
import Home from './pages/Home';
import Memories from './pages/Memories'
import Menu from './components/Menu'
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
/* Theme variables */
import './theme/variables.css';

const Login: React.FC = () => {
  return(
    <IonPage>
      <IonContent className="ion-text-center">
        <IonButton color="secondary" routerLink="/home">Login</IonButton>
      </IonContent>
    </IonPage>
  )
}


class App extends React.Component {

  render() {
    return(
    <IonApp>
        <Menu /> 
        <IonButtons slot="start">
          <IonMenuButton autoHide={false} menu="main-menu"></IonMenuButton>
          <IonBackButton defaultHref="/login" />
        </IonButtons>
      <IonContent>
        <IonReactRouter>
          <IonTabs>
            <IonRouterOutlet>
              <Route path="/login" component={Login} exact />
              <Route path="/create" component={Create} exact />
              <Route path="/memories" component={Memories} exact />
              <Route path="/home" component={Home} />
              <Route path="/" render={() => <Redirect to="/login"/>} exact={true} />
            </IonRouterOutlet>

            <IonTabBar slot="bottom">
              <IonTabButton tab="home" href="/home">
                <IonIcon icon={home} />
                <IonLabel>Home</IonLabel>
              </IonTabButton>

              <IonTabButton tab="create" href="/create">
                <IonIcon icon={addCircle} />
                <IonLabel>Create</IonLabel>
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        </IonReactRouter>
      </IonContent>
    </IonApp>
    )
  }
};

export default App;
