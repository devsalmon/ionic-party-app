import React, { Component } from 'react';
import { IonReactRouter } from '@ionic/react-router';
import Navbar from '../components/layout/Navbar'

class Mario extends React.Component {
    render() {
        return (
            <IonReactRouter>
                <div className="Mario">
                    <Navbar />
                </div>
            </IonReactRouter>
        )
    }
}

export default Mario;
