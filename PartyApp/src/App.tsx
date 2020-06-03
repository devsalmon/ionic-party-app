import React, { useState } from 'react';
import { Redirect, Route, } from 'react-router-dom';
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
  IonSplitPane,
  IonFooter,
  IonSearchbar,
  IonRow,
  IonCol,
  IonInput
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { home, add, addCircle, logIn } from 'ionicons/icons';
import Create from './pages/Create';
import Home from './pages/Home';
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

const Nick: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  return(
    <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>IonSearchBar Examples</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <p>Default Searchbar</p>
      <IonSearchbar value={searchText} onIonChange={e => setSearchText(e.detail.value!)}></IonSearchbar>

      <p>Searchbar with cancel button always shown</p>
      <IonSearchbar value={searchText} onIonChange={e => setSearchText(e.detail.value!)} showCancelButton="always"></IonSearchbar>

      <p>Searchbar with cancel button never shown</p>
      <IonSearchbar value={searchText} onIonChange={e => setSearchText(e.detail.value!)} showCancelButton="never"></IonSearchbar>

      <p>Searchbar with cancel button shown on focus</p>
      <IonSearchbar value={searchText} onIonChange={e => setSearchText(e.detail.value!)} showCancelButton="focus"></IonSearchbar>

      <p>Searchbar with danger color</p>
      <IonSearchbar value={searchText} onIonChange={e => setSearchText(e.detail.value!)} color="danger"></IonSearchbar>

      <p>Searchbar with telephone type</p>
      <IonSearchbar value={searchText} onIonChange={e => setSearchText(e.detail.value!)} type="tel"></IonSearchbar>

      <p>Searchbar with numeric inputmode</p>
      <IonSearchbar value={searchText} onIonChange={e => setSearchText(e.detail.value!)} inputmode="numeric"></IonSearchbar>

      <p>Searchbar disabled </p>
      <IonSearchbar value={searchText} onIonChange={e => setSearchText(e.detail.value!)} disabled={true}></IonSearchbar>

      <p>Searchbar with a cancel button and custom cancel button text</p>
      <IonSearchbar value={searchText} onIonChange={e => setSearchText(e.detail.value!)} showCancelButton="focus" cancelButtonText="Custom Cancel"></IonSearchbar>

      <p>Searchbar with a custom debounce - Note: debounce only works on onIonChange event</p>
      <IonSearchbar value={searchText} onIonChange={e => setSearchText(e.detail.value!)} debounce={1000}></IonSearchbar>

      <p>Animated Searchbar</p>
      <IonSearchbar value={searchText} onIonChange={e => setSearchText(e.detail.value!)} animated></IonSearchbar>

      <p>Searchbar with a placeholder</p>
      <IonSearchbar value={searchText} onIonChange={e => setSearchText(e.detail.value!)} placeholder="Filter Schedules"></IonSearchbar>

      <p>Searchbar in a Toolbar</p>
      <IonToolbar>
        <IonSearchbar value={searchText} onIonChange={e => setSearchText(e.detail.value!)}></IonSearchbar>
      </IonToolbar>

    </IonContent>
    <IonFooter>
      <IonToolbar>
        Search Text: {searchText ?? '(none)'}
      </IonToolbar>
    </IonFooter>
  </IonPage>
);
};

const Test: React.FC = () => {
  return(
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Another quick test. Will delete</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonRow>
        <IonCol>
          <IonItem>
            <IonLabel position="floating">Write Here</IonLabel>
            <IonInput></IonInput>
          </IonItem>
        </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
  };

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
              <Route path="/home" component={Home} />
              <Route path="/nickspage" component={Nick} />
              <Route path="/nickstestpage" component={Test} />
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
