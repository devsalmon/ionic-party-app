import React, { useState, useEffect} from 'react';
import { Route, Redirect } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar, 
  IonTabButton,
  IonTabs, 
  IonItem,
  IonLoading,
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
  IonSearchbar,
  IonRow,
  IonCol,
  IonInput,
  IonModal, 
  IonDatetime,
  IonCheckbox, 
  IonGrid,
  IonTextarea,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonMenu,
  IonMenuToggle,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { home, addCircle, logIn, peopleCircleOutline, personCircleOutline, starSharp } from 'ionicons/icons';

import firebase from './firestore'

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

// once finished, run ionic build then npx cap add ios and npx cap add android

export class SignIn extends React.Component {
    state = {
        email: '',
        password: '',
    }
    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }
    handleSubmit = (e) => {
        e.preventDefault()
        console.log(this.state)
    }
    render() {
        return (
            <IonPage>
                <IonToolbar>
                    <IonTitle>Sign in</IonTitle>
                </IonToolbar>
                <IonContent>
                    <IonItem>
                        <IonLabel>Email</IonLabel>
                        <IonInput id="email" onIonChange={this.handleChange} placeholder="username"></IonInput>
                    </IonItem>  
                    <IonItem>
                        <IonLabel>Password</IonLabel>
                        <IonInput id="password" onIonChange={this.handleChange} placeholder="password"></IonInput>
                    </IonItem>  
                    <IonButton onClick={this.handleSubmit} >Login</IonButton>
                </IonContent>
            </IonPage>
        )
    }
}

class Page {
  title: string = '';
  url: string = '';
  icon: string = '';
};
const appPages: Page[] = [
  {title: 'Upcoming parties', url: '/', icon: home},
  {title: 'Create a party', url: '/create', icon: addCircle},
  {title: 'Login page', url: '/login', icon: logIn},
  {title: 'Memories', url: '/memories', icon: peopleCircleOutline},
]

const Links = () => {
    return(
      <IonList>
        <IonItem href='/'>
          <IonLabel>Log Out</IonLabel>
        </IonItem>
        <IonItem href='/'>
          <IonIcon icon={personCircleOutline}></IonIcon>
        </IonItem>
        <IonItem color="primary">
          <IonIcon slot="start" icon={starSharp}/>
          <IonLabel>Guest rating: </IonLabel>
        </IonItem>
        {appPages.map((appPage, index) => {
        return (
          <IonMenuToggle key={index} auto-hide="false">
          <IonItem color="primary" href={appPage.url}>
              <IonIcon slot="start" icon={appPage.icon} />
              <IonLabel>{appPage.title}</IonLabel>
          </IonItem>
          </IonMenuToggle>
        );
        })}
      </IonList>
)
};

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
            <Links /> 
          </IonContent>
        </IonMenu>
      </IonMenuToggle>
      <IonRouterOutlet id="main">
      </IonRouterOutlet>
      </div>
    );
  }  
}

const Create: React.FC = (props) => {

  const [showLoading, setShowLoading] = useState(false);
  const [date, setDate] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [location, setLocation] = useState<string>('')
  const [details, setDetails] = useState<string>('')
  const [endTime, setEndTime] = useState<string>('')
  const [startTime, setStartTime] = useState<string>('')
  const [searchText, setSearchText] = useState<string>('')
  const [friendList, setFriendList] = useState([])
  const [showModal, setShowModal] = useState(false);
  const [checked, setChecked] = useState(false);
  const fbRef = firebase.database().ref('parties/') 

  const createParty = () => {
    fbRef.orderByChild('date').once('value', resp => {
      let cdata = snapshotToArray(resp)
        let partyDetails = { 
          title: title, 
          date: date, 
          location: location,
          details: details,
          endTime: endTime,
          startTime: startTime,          
        }
        fbRef.push(partyDetails, (error) =>{
          if (error) {
            console.log("Data could not be saved." + error);
          } else { // reset everything
            console.log('worked')
            setDate('')
            setTitle('')
            setLocation('')
            setDetails('')
            setEndTime('')
            setStartTime('')
            let prop: any = props;
            prop.history.push({
              pathname: '/'
            })
          }
        })
    })
  }

  const snapshotToArray = (snapshot: any) => {
    const returnArr: any[] = []
  
    snapshot.forEach((childSnapshot: any) => {
      const item = childSnapshot.val()
      item.key = childSnapshot.key
      returnArr.push(item)
    });
  
    return returnArr;
  }

  return(

  <IonPage className="ion-padding">
    <IonToolbar>
      <IonTitle className="ion-text-center">Create a party</IonTitle>
    </IonToolbar>
    <IonContent>
      <IonLoading
        isOpen={showLoading}
        onDidDismiss={() => setShowLoading(false)}
        message={'Loading...'}
      />
      <IonList>
        <IonItem>
          <IonInput value={title} onIonChange={e => setTitle(e.detail.value!)} placeholder="Title (e.g. Bruno's 17th)" clearInput></IonInput>
        </IonItem>

        <IonItem>
          <IonInput value={location} onIonChange={e => setLocation(e.detail.value!)} placeholder="Location" clearInput></IonInput>
        </IonItem>

        <IonItem>
          <IonLabel>Date</IonLabel>
          <IonDatetime value={date} onIonChange={e => setDate(e.detail.value!)} placeholder="Select Date"></IonDatetime>
        </IonItem>

        <IonItem>
          <IonLabel>Time</IonLabel>
          <IonDatetime value={startTime} onIonChange={e => setStartTime(e.detail.value!)} display-format="h:mm A" picker-format="h:mm A" placeholder="Select Time"></IonDatetime>
        </IonItem>

        <IonItem>
          <IonLabel>Ends</IonLabel>
          <IonDatetime value={endTime} onIonChange={e => setEndTime(e.detail.value!)} display-format="h:mm A" picker-format="h:mm A" placeholder="Select Time"></IonDatetime>
        </IonItem>

        <IonItem>
          <IonTextarea value={details} onIonChange={e => setDetails(e.detail.value!)} placeholder="Additional Details"></IonTextarea>
        </IonItem>
      </IonList>
      <IonModal isOpen={showModal}>
        <IonHeader>
          <IonToolbar>              
            <IonGrid>
              <IonRow>
                <IonCol>
                <IonTitle className="ion-text-center">Select people to invite</IonTitle>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="9">
                  <IonSearchbar value={searchText} onIonChange={e => setSearchText(e.detail.value!)} showCancelButton="focus" color="danger"></IonSearchbar>                  
                </IonCol>
                <IonCol>
                  <IonButton fill="clear" onClick={e => setShowModal(false)}>Done</IonButton>
                </IonCol>                  
              </IonRow>
            </IonGrid>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            {friendList.map(({ val, isChecked }, i) => (
              <IonItem key={i}>
                <IonLabel>{val}</IonLabel>
                <IonCheckbox slot="end" color="danger" value={val} checked={isChecked} />
              </IonItem>
            ))}
          </IonList>
        </IonContent>
      </IonModal>
      <IonButton expand="block" onClick={e => setShowModal(true)}>Invite People</IonButton>
      <IonButton expand="block" onClick={() => { createParty() }}>CREATE!</IonButton>

      </IonContent>
  </IonPage>
  )
};


class Home extends React.Component {

  render(){
    const fbRef = firebase.database().ref('party-up/') // firebase project reference
    return(
      <IonPage>
        <IonToolbar>
          <IonTitle className="ion-text-center">Upcoming parties</IonTitle>
        </IonToolbar>
        <IonContent className="ion-padding">
        <IonGrid>
          <IonRow>
            <IonCol>
              <p>PARTY LIST</p>
            </IonCol>
          </IonRow>  
        </IonGrid>
        </IonContent>
      </IonPage>
    )
  }
}

class App extends React.Component {

  render() {
    return(
    <IonApp>
      <Menu /> 
        <IonButtons slot="start">
          <IonMenuButton autoHide={false} menu="main-menu"></IonMenuButton>
          <IonBackButton defaultHref="/signin" />
        </IonButtons>
      <IonContent>
        <IonReactRouter>
          <IonTabs>
            <IonRouterOutlet>       
              <Route path='/signin' component={SignIn} />
              <Route path='/create' component={Create} />
              <Route path='/home' component={Home} exact />      
              <Route exact path="/" render={() => <Redirect to="/home" />} />
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
