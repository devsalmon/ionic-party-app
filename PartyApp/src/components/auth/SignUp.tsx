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

export class SignUp extends Component {
    state = {
        email: '',
        password: '',
        firstName:'',
        lastName: ''
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

export default SignUp