import React, { Component } from 'react'
import {
    IonInput,
    IonItem,
    IonButton,
    IonPage,
    IonTitle,
    IonLabel,
    IonToolbar,
    IonContent
}
from '@ionic/react'


export class SignIn extends Component {
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

export default SignIn
