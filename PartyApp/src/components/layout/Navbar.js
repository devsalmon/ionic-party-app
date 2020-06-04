import React from 'react'
import { Link } from 'react-router-dom'
import {
    IonNav,
  } from '@ionic/react';

const Navbar = () => {
    return (
        <IonNav>
            <div className="container">
                <Link to='/' className="brand-logo">MarioPlan</Link> 
            </div>
        </IonNav>
    )
}

export default Navbar;