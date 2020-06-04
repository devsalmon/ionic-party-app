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
  IonLabel
  } from '@ionic/react';
import { home, add, addCircle, logIn, peopleCircleOutline, starSharp, triangle } from 'ionicons/icons';

class Page {
  title: string = '';
  url: string = '';
  icon: string = '';
};
const appPages: Page[] = [
  {title: 'Upcoming parties', url: '/home', icon: home},
  {title: 'Create a party', url: '/create', icon: addCircle},
  {title: 'Login page', url: '/login', icon: logIn},
  {title: 'Memories', url: '/memories', icon: peopleCircleOutline},
  {title: "Nick's page", url: '/nickspage', icon: triangle},
  {title: "Nick's 2nd page", url: '/nickstestpage', icon: triangle},
  {title: "Mario Page", url: '/mario', icon: home}
]

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
          </IonContent>
        </IonMenu>
      </IonMenuToggle>
      <IonRouterOutlet id="main"></IonRouterOutlet>
      </div>
    );
  }  
}

export default Menu;