import React, { Component } from 'react';
import { Redirect, Route, Link, NavLink, BrowserRouter } from 'react-router-dom';
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';




import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ellipse, square, triangle } from 'ionicons/icons';
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';

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

// const App: React.FC = () => (
//   <IonApp>
//     <IonReactRouter>
//       <IonTabs>
//         <IonRouterOutlet>
//           <Route path="/tab1" component={Tab1} exact={true} />
//           <Route path="/tab2" component={Tab2} exact={true} />
//           <Route path="/tab3" component={Tab3} />
//           <Route path="/" render={() => <Redirect to="/tab1" />} exact={true} />
//         </IonRouterOutlet>
//         <IonTabBar slot="bottom">
//           <IonTabButton tab="tab1" href="/tab1">
//             <IonIcon icon={triangle} />
//             <IonLabel>Tab 1</IonLabel>
//           </IonTabButton>
//           <IonTabButton tab="tab2" href="/tab2">
//             <IonIcon icon={ellipse} />
//             <IonLabel>Tab 2</IonLabel>
//           </IonTabButton>
//           <IonTabButton tab="tab3" href="/tab3">
//             <IonIcon icon={square} />
//             <IonLabel>Tab 3</IonLabel>
//           </IonTabButton>
//         </IonTabBar>
//       </IonTabs>
//     </IonReactRouter>
//   </IonApp>
// );

// export default App;
class App extends Component {
  render(){
    return (
      <BrowserRouter>
      <div className="App">
        <BottomNav />
        <Route exact path='/' component={Home} />
        <Route path='/add' component={Add} />
        <Route path='/nearby' component={Nearby} />
      </div>
      </BrowserRouter>
    );
  }
}

function BottomNav() {
  const classes = makeStyles();
  const [value, setValue] = React.useState(0);

  return (
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      showLabels
    >
      <BottomNavigationAction 
      component={Link} 
      to="/"
      label="Home" 
      icon={<IonIcon icon={square}/>} />
      <BottomNavigationAction       
      component={Link} 
      to="/add"
      label="Add" 
      icon={<IonIcon icon={square} />} />
      <BottomNavigationAction       
      component={Link} 
      to="/nearby"
      label="Nearby" 
      icon={<IonIcon icon={square} />} />
    </BottomNavigation>
  );
}

/*const Navbar = (props) => {
    // function to redirect page to 'Add' page:
    // setTimeout(() => {props.history.push('/Add')}, 2000);
    return(
        <nav className="nav-wrapper red darken">
            <div className="container">
                <a className="brand-logo">(Addlogo) Upcoming parties</a>
                <ul className="right">
                    <li><NavLink to="/">Home</NavLink></li>
                    <li><NavLink to="/Add">Add</NavLink></li>
                    <li><NavLink to="/Nearby">Nearby</NavLink></li>
                </ul>
            </div>
        </nav>
    )
}
// link tags prevent page from refreshing
// navlink tags allow for different styles in different active pages*/


class Home extends Component {
    state = {
        posts: []
    }
    // could use fetch instead of axios
    componentDidMount(){
        axios.get('https://jsonplaceholder.typicode.com/posts')
            .then(res =>{
                console.log(res)
                this.setState({
                    posts: res.data.slice(0,10)
                })
            })
    }
    render(){
        const { posts } = this.state;
        const postList = posts.length ? (
            posts.map(post => {
                return(
                  <div className="post card" key={post.id}>
                      <div className="card-content">
                          <span className="card-title">
                              {post.title}
                          </span>
                          <p>{post.body}</p>
                      </div>
                  </div>
                )
            })
        ) : (
            <div className="center">No parties yet</div>
        )
        return(
            <div className="container">
                {postList}
            </div>
        )
    }
}

const Add = () => {
    return(
        <div className="container">
            <h4 className="center">Add</h4>
            <p>this is the Add page</p>
        </div>
    )
}


const Nearby = (props) => {
    return(
        <div className="container">
            <h4 className="center">Nearby</h4>
            <p>this is the Nearby page</p>
        </div>
    )
}

 export default App;
