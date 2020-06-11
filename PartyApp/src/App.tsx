import React from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar, 
  IonTabButton,
  IonTabs, 
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

import createParty from './store/partyActions';

import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase';
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


export class SignUp extends React.Component {
    state = {
        email: '',
        password: '',
        firstName:'',
        lastName: '',
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
                    <IonTitle>Sign Up</IonTitle>
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
                    <IonItem>
                        <IonLabel>First Name</IonLabel>
                        <IonInput id="firstName" onIonChange={this.handleChange} placeholder="first name"></IonInput>
                    </IonItem>   
                    <IonItem>
                        <IonLabel>Last Name</IonLabel>
                        <IonInput id="lastName" onIonChange={this.handleChange} placeholder="last name"></IonInput>
                    </IonItem>  
                    <IonButton onClick={this.handleSubmit} >Sign Up</IonButton>
                </IonContent>
            </IonPage>
        )
    }
}


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

const SignedOutLinks = () => {
    return(
      <IonList>
        <IonMenuToggle>
        <IonItem href='/signin'>
          <IonLabel>Log In</IonLabel>
        </IonItem>
        <IonItem href='/signup'>
          <IonLabel>Sign Up</IonLabel>
        </IonItem>
        </IonMenuToggle>
      </IonList>
)
};


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

const SignedInLinks = () => {
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


const PartyDetails = (props) => {
    const id = props.match.params.id;
    return(
    <IonCard>
        <IonCardHeader>
        <IonCardTitle>Party Title - {id}</IonCardTitle>
        </IonCardHeader>

        <IonCardContent>
        Keep close to Nature's heart... and break clear away, once in awhile,
        and climb a mountain or spend a week in the woods. Wash your spirit clean.
        </IonCardContent>
    </IonCard>
    )
}

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


const PartySummary = ({party}) => {
    return(
    <IonCard>
        <IonCardHeader>
        <IonCardTitle>{party.title}</IonCardTitle>
        </IonCardHeader>

        <IonCardContent>
        Keep close to Nature's heart... and break clear away, once in awhile,
        and climb a mountain or spend a week in the woods. Wash your spirit clean.
        </IonCardContent>
    </IonCard>
    )
}


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

const Notifications = () => {
    return(
    <IonList>
        <IonItem>Notifications</IonItem>
    </IonList>
    )
}

const Memories: React.FC = () => {
    return(
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle className="ion-text-center">Memories</IonTitle>
                </IonToolbar>
            </IonHeader>
        </IonPage>
    );
};

class Create extends React.Component<ICreateProps> {

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
              <IonGrid>
                <IonRow>
                  <IonCol>
                  <IonTitle className="ion-text-center">Select people to invite</IonTitle>
                  </IonCol>
                </IonRow>
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

const mapDispatchToProps = (dispatch) => {
  return{
    createParty: (party) => dispatch(createParty(party))
  }
}

connect(null, mapDispatchToProps)(Create);

interface IHomeProps extends RouteComponentProps<any> {
  parties?: string[]
}

class Home extends React.Component<IHomeProps> {

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

const mapStateToProps = (state) => {
  return { parties: state.party.parties }
}
// compose(firestoreConnect(()=>['parties']),connect(mapStateToProps)(HomeWithRouter))


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
              <Route path='/party/:id' component={PartyDetails} />
              <Route path='/signin' component={SignIn} />
              <Route path='/signup' component={SignUp} />
              <Route path='/create' component={Create} />
              <Route path='/memories' component={Memories} />
              <Route path='/' component={Home} exact />      
            </IonRouterOutlet> 
            <IonTabBar slot="bottom">
              <IonTabButton tab="home" href="/">
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
