import React, {Component} from 'react';
import './App.css';
import 'typeface-roboto'

import EleveApp from './components/EleveApp';

import Reboot from 'material-ui/Reboot/Reboot';

const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

// Initialize Firebase

var firebaseconfig = require("./firebase/sostamarapport-firebase.json")
firebase.initializeApp(firebaseconfig);

//admin app
var admin = firebase.initializeApp(firebaseconfig,"admin");

//<img src={logo} className="App-logo" alt="logo"/>

class App extends Component {
  constructor(props) {
    super(props);
    
  }
  render() {
    return (
      <div>
        <Reboot/>
        <EleveApp firebase={firebase} admin={admin}/>
      </div>
    );
  }
}

export default App;
