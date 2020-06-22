import React, { useState, useEffect} from 'react';
import { Route, Redirect } from 'react-router-dom';
import {useDocument, useCollection} from 'react-firebase-hooks/firestore';
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
  IonItemGroup,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonMenu,
  IonMenuToggle,
  IonItemSliding,
  IonText,
  IonToast,
  IonCardSubtitle,
  IonFooter,
  IonAvatar,
  IonFab,
  IonPopover,
  IonFabButton,
  IonFabList,
  IonRefresher,
  IonRefresherContent,
  IonRippleEffect
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { 
  home, 
  addCircle, 
  logIn, 
  peopleCircleOutline, 
  chevronDownCircleOutline, 
  arrowDownCircle, 
  arrowForwardCircle, 
  personCircleOutline, 
  starSharp,  
  imageSharp,
  notificationsSharp,
  personCircleSharp,
  cameraSharp
} from 'ionicons/icons';

import './App.css'
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
import './variables.css';
import { sign } from 'crypto';

// once finished, run ionic build then npx cap add ios and npx cap add android

// Signs-in Messaging with GOOGLE POP UP
const SignInGooglepu = async() => {
  // Initiate Firebase Auth.
  // Sign into Firebase using popup auth & Google as the identity provider.
  var provider = new firebase.auth.GoogleAuthProvider();
  //Sign in with pop up
  firebase.auth().signInWithPopup(provider).then(function (result) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    //var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    const isNewUser = result.additionalUserInfo.isNewUser
    if (isNewUser) {
      firebase.firestore().collection('users').add({
      name: user.displayName,
      photoUrl: user.photoURL
      }) }

  }).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
  });

  // Get the signed-in user's profile pic and name.
  //var profilePicUrl = getProfilePicUrl();
  //var userName = getUserName();

  // Set the user's profile pic and name.
  //document.getElementById('user-pic').style.backgroundImage = 'url(' + addSizeToGoogleProfilePic(profilePicUrl) + ')';
  //document.getElementById('user-name').textContent = userName;
}

// Signs out of Party app.
const signOut = async() => {
  // Sign out of Firebase.
  firebase.auth().signOut();
  //alert("YOU JUST SIGNED OUT")
  }


const SignIn = () => {

  const [email] = useState<string>('');
  const [password] = useState<string>('');

  return (
    <IonPage>
        <IonToolbar>
          <IonTitle class="big-heading">Sign in</IonTitle>
        </IonToolbar>
        <IonContent className="ion-padding ion-text-center">
          <IonItem>
              <IonLabel>Email</IonLabel>
              <IonInput value={email} placeholder="username"></IonInput>
          </IonItem>  
          <IonItem>
              <IonLabel>Password</IonLabel>
              <IonInput value={password} placeholder="password"></IonInput>
          </IonItem>  
          <IonButton onClick={() => SignInGooglepu()}>Login</IonButton>
        </IonContent>
    </IonPage>
  )
}

const Profile: React.FC = () => {

  return(
    <IonPage>
      <IonToolbar>
        <IonTitle></IonTitle>
        <IonAvatar></IonAvatar>
      </IonToolbar>
      <IonContent>
        User details...
      </IonContent>
    </IonPage>
  )
}


const Users: React.FC = () => {
  const [value, loading, error] = useCollection(
    firebase.firestore().collection('users'),
  );

  const userList = []
  const filterUsers = (event) => {
    requestAnimationFrame(() => {    
      value.docs.map(doc => {   
        userList.push(doc.data().name.toLowerCase())
      });
    })
  }
  return(
    <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Users</IonTitle> 
        <IonSearchbar onIonChange={e => filterUsers(e.detail.value!)}></IonSearchbar>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <IonList>
        {value && value.docs.map(doc => {
          return(
            !loading && ( //filter list data with searchbar            
              <IonCard button={true} key={doc.id}>
                <IonCardHeader>
                  <IonCardTitle>{doc.data().name}</IonCardTitle>
                </IonCardHeader>
              </IonCard>
            )
          )
        })}
      </IonList>
    </IonContent>
    </IonPage>
  )
}


class Page {
  title: string = '';
  url: string = '';
  icon: string = '';
};
const appPages: Page[] = [
  {title: 'Users', url: '/users', icon: peopleCircleOutline},
]

const Links = () => {
  return(
    <IonList>
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


//TODO - 
// Add friends page
// create toast to let user know they created a party successfully
// after user signs in, direct to the home page
// log in function after signing up
// delete party document in firebase after it's happened

const Party = ({doc}) => {
  // party card
  const [showPopover, setShowPopover] = useState(false);
  let data = doc.data()
  return(
    <>
    <IonCard button onClick={() => setShowPopover(true)}>
      <IonCardHeader>      
      <IonGrid>
        <IonRow>
          <IonCol size="8">
            <IonCardSubtitle>{data.date}</IonCardSubtitle>
            <IonCardTitle>{data.title}</IonCardTitle>
          </IonCol>
          <IonCol className="ion-text-right">
            <IonButton expand="full" href='/camera'>
              <IonIcon icon={cameraSharp} />
            </IonButton>
          </IonCol>
        </IonRow>        
      </IonGrid>
      </IonCardHeader>
    </IonCard>
    <IonPopover
      isOpen={showPopover}
      cssClass='popover'
      onDidDismiss={e => setShowPopover(false)}
    >
      <IonItemGroup className="ion-padding">  
        <IonLabel>Details:</IonLabel>
        <IonItem>{data.details}</IonItem>
        <IonLabel>Location:</IonLabel>
        <IonItem>{data.location}</IonItem>
        <IonLabel>Starts:</IonLabel>          
        <IonItem>{data.startTime}</IonItem>
        <IonLabel>Ends:</IonLabel>
        <IonItem>{data.endTime}</IonItem>
      </IonItemGroup>   
    </IonPopover>
    </>
  )
}

const PartyList = () => {
  const [value, loading, error] = useCollection(
    firebase.firestore().collection("parties").orderBy("createdOn", "desc"),
  );

  return(
    <IonList>
      {value && value.docs.map(doc => {
        return(
          !loading && (
            <Party doc={doc} key={doc.id} />
          )
        )
      })}
    </IonList>
  )
}

const Create: React.FC = () => {
  
  const [current, setCurrent] = useState(null); // used to reset input form values

  return(
    <IonPage>
      <IonToolbar className="ion-padding">
        <IonTitle className="ion-text-center">Create a party</IonTitle>  
      </IonToolbar>
      <CreateParty initialValue={current} clear={() => setCurrent(null)}/>
    </IonPage>
  )

}


const CreateParty = ({initialValue, clear}) => {

  // initialValue is null

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
  const [showToast, setShowToast] = useState(false);

  const [value, loading, error] = useDocument(
    firebase.firestore().doc("parties/" + initialValue)
  );

  useEffect(() => {
    if (value !== undefined) {
    !loading && initialValue && setTitle(value.data().title);
    }
  },
  [loading, initialValue, value]);

  const onSave = async() => {

    let collectionRef = firebase.firestore().collection("parties");
    if(initialValue) { // maybe delete this await
      await (collectionRef).doc(initialValue).set(
        { title: title, 
          date: date, 
          location: location,
          details: details,
          endTime: endTime,
          startTime: startTime,       
          // convert firestore timestamp to date format
          createdOn: new Date(firebase.firestore.Timestamp.now().seconds*1000).toLocaleDateString()
        }, 
        {merge:true} 
        );
        setTitle("");
        setDate("")
        setLocation("");
        setDetails("");
        setEndTime("");
        setStartTime("");
        // TODO setShowToast(true) if all inputs added
        // convert date format from iondatetime's format
        clear();
    }
    else {
      await collectionRef.add(
        {title: title, 
        location: location, 
        date: date, 
        details: details,
        endTime: endTime,
        startTime: startTime,
        // convert firestore timestamp to date format
        createdOn: new Date(firebase.firestore.Timestamp.now().seconds*1000).toLocaleDateString()})
        setTitle("");
        setDate("")
        setLocation("");
        setDetails("");
        setEndTime("");
        setStartTime("");
      setShowToast(true);
      clear();
    }
  }

  return(

    <IonContent className="ion-padding">
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
        <IonLabel>Starts</IonLabel>
        <IonDatetime value={startTime} onIonChange={e => setStartTime(e.detail.value!)} display-format="h:mm A" picker-format="h:mm A" placeholder="Select Time"></IonDatetime>
      </IonItem>

      <IonItem>
        <IonLabel>Ends</IonLabel>
        <IonDatetime value={endTime} onIonChange={e => setEndTime(e.detail.value!)} display-format="h:mm A" picker-format="h:mm A" placeholder="Select Time"></IonDatetime>
      </IonItem>

      <IonItem>
        <IonTextarea value={details} onIonChange={e => setDetails(e.detail.value!)} placeholder="Additional details"></IonTextarea>
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
    <IonButton expand="block" onClick={() => onSave()}>CREATE!</IonButton>
    <IonToast
      isOpen={showToast}
      onDidDismiss={() => setShowToast(false)}
      duration={2000}
      message="Party Created!"
      position="bottom"
    />
    </IonContent>
  )
};

const Camera: React.FC = () => {

  return(
    <IonPage>
      <IonToolbar>
        <IonTitle className="ion-text-center">Camera</IonTitle>
      </IonToolbar>
    </IonPage>
  )
}


const Inbox: React.FC = () => {

  return(
    <IonPage>
      <IonToolbar>
        <IonTitle className="ion-text-center">Invites</IonTitle>
      </IonToolbar>
      <IonContent className="ion-padding">
        <IonFab vertical="top" horizontal="end" slot="fixed" edge>
          <IonFabButton>
            <IonIcon icon={arrowDownCircle} />
          </IonFabButton>          
          <IonFabList side="bottom">
            <IonFabButton><IonIcon icon={starSharp} /></IonFabButton>
            <IonFabButton><IonIcon icon={addCircle} /></IonFabButton>
            <IonFabButton><IonIcon icon={home} /></IonFabButton>
          </IonFabList>
        </IonFab>      
        Friend requests, activity....  
      </IonContent>
    </IonPage>
  )
}

const Memories: React.FC = () => {

  return(
    <IonPage>
      <IonToolbar>
        <IonTitle className="ion-text-center">Memories</IonTitle>
      </IonToolbar>
      <IonContent className="ion-padding">
        <IonFab vertical="top" horizontal="end" slot="fixed" edge>
          <IonFabButton>
            <IonIcon icon={arrowDownCircle} />
          </IonFabButton>          
          <IonFabList side="bottom">
            <IonFabButton><IonIcon icon={starSharp} /></IonFabButton>
            <IonFabButton><IonIcon icon={addCircle} /></IonFabButton>
            <IonFabButton><IonIcon icon={home} /></IonFabButton>
          </IonFabList>
        </IonFab>      
        Past party list.........    
      </IonContent>
    </IonPage>
  )
}

const Home: React.FC = () => {

  return(
    <IonPage>
      <IonToolbar>
        <IonTitle className="ion-text-center">Upcoming parties</IonTitle>
      </IonToolbar>
      <IonContent className="ion-padding">
        <IonFab vertical="top" horizontal="end" slot="fixed" edge>
          <IonFabButton>
            <IonIcon icon={arrowDownCircle} />
          </IonFabButton>          
          <IonFabList side="bottom">
            <IonFabButton><IonIcon icon={starSharp} /></IonFabButton>
            <IonFabButton><IonIcon icon={addCircle} /></IonFabButton>
            <IonFabButton><IonIcon icon={home} /></IonFabButton>
          </IonFabList>
        </IonFab>        
        <PartyList />     
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
        <IonButton href="/signin" slot="end" onClick={() => signOut()}>SignOut</IonButton>
      </IonButtons>
      <IonContent>
        <IonReactRouter>
          <IonTabs>
            <IonRouterOutlet>       
              <Route path='/signin' component={SignIn} />
              <Route path='/create' component={Create} />
              <Route path='/users' component={Users} />
              <Route path='/profile' component={Profile} />
              <Route path='/inbox' component={Inbox} />
              <Route path='/camera' component={Camera} />
              <Route path='/memories' component={Memories} />
              <Route path='/home' component={Home} exact />      
              <Route exact path="/" render={() => <Redirect to="/home" />} />
            </IonRouterOutlet> 
            <IonTabBar slot="bottom">
              <IonTabButton tab="home" href="/home">
                <IonIcon icon={home} />
                <IonLabel>Home</IonLabel>
                <IonRippleEffect></IonRippleEffect>
              </IonTabButton>

              <IonTabButton tab="memories" href="/memories">
                <IonIcon icon={imageSharp} />
                <IonLabel>Memories</IonLabel>
                <IonRippleEffect></IonRippleEffect>
              </IonTabButton>
              
              <IonTabButton tab="create" href="/create">
                <IonIcon icon={addCircle} />
                <IonLabel>Create</IonLabel>
                <IonRippleEffect></IonRippleEffect>
              </IonTabButton>  

              <IonTabButton tab="inbox" href="/inbox">
                <IonIcon icon={notificationsSharp} />
                <IonLabel>Inbox</IonLabel>
                <IonRippleEffect></IonRippleEffect>
              </IonTabButton>

              <IonTabButton tab="profile" href="/profile">
                <IonIcon icon={personCircleSharp} />
                <IonLabel>Profile</IonLabel>
                <IonRippleEffect></IonRippleEffect>                
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
