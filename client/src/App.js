import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import axios from "axios";
import "./App.css";
import AppForm from "./components/AppForm";
import Vote from "./components/Vote";
import Login from "./components/Login";
import Registration from "./components/Registration";
import Navbar from "./components/customComponents/Navbar";
import SubmitVote from "./components/SubmitVote"
import ViewAppForms from "./components/ViewAppForms"
import AppFormEdit from './components/AppFormEdit'
import imageComponent from './components/imageComponent'
axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Navbar />
          <Switch>
            <Route path="/AppForm" component={AppForm} />
            <Route path="/AppFormEdit" component={AppFormEdit} />
            <Route path="/Vote" component={Vote} />
            <Route path="/Login" component={Login} />
            <Route path="/Registration" component={Registration} />
            <Route path="/SubmitVote" component={SubmitVote} />
            <Route path="/viewApplications" component={ViewAppForms} />
            <Route path="/" component={imageComponent}/>
          </Switch>
        </div>
      </Router>
           //</Router>

    );
  }
}

export default App;
