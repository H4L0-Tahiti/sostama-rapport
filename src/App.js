import React, { Component } from "react";
import "./App.css";
import "typeface-roboto";

import EleveApp from "./components/EleveApp";

const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

// Initialize Firebase

var firebaseconfig = require("./firebase/sostamarapport-firebase.json");
firebase.initializeApp(firebaseconfig);

//admin app
var admin = firebase.initializeApp(firebaseconfig, "admin");

//<img src={logo} className="App-logo" alt="logo"/>
firebase.auth().languageCode = "fr";
admin.auth().languageCode = "fr";

class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <EleveApp firebase={firebase} admin={admin} />
      </div>
    );
  }
}

export default App;
