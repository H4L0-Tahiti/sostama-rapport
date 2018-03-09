import React, {Component} from 'react';
import './App.css';
import 'typeface-roboto'

import EleveApp from './components/EleveApp';

import Reboot from 'material-ui/Reboot/Reboot';
import Reactotron from 'reactotron-react-js'

const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyDaACU0uVkmHgRYCLwtP8ZuDSqa67RIC_8",
  authDomain: "sostamarapport.firebaseapp.com",
  databaseURL: "https://sostamarapport.firebaseio.com",
  projectId: "sostamarapport",
  storageBucket: "sostamarapport.appspot.com",
  messagingSenderId: "484972558539"
});


//<img src={logo} className="App-logo" alt="logo"/>

class App extends Component {
  constructor(props) {
    super(props);
    
    firebase.firestore();
    firebase.auth();

    this.state = {
      firebase: firebase,
    };
    Reactotron.log('frebase up')
  }
  render() {
    return (
      <div>
        <Reboot/>
        <EleveApp firebase={this.state.firebase}/>
      </div>
    );
  }
}

export default App;
