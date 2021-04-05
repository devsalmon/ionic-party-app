import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Plugins } from '@capacitor/core';
const { App: CapApp } = Plugins;

const AppUrlListener: React.FC<any> = () => {
  let history = useHistory();
  useEffect(() => {
      console.log("url listener use effect triggered")
    CapApp.addListener('appUrlOpen', (data: any) => {
      // Example url: https://beerswift.app/tabs/tab2
      // slug = /tabs/tab2      
      const slug = data.url.split('.app').pop();
      console.log(data.url);
      if (slug) {
        history.push(slug);
      }
      // If no match, do nothing - let regular routing
      // logic take over
    });
  }, []);

  return null;
};

export default AppUrlListener;