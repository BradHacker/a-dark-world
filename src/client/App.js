import React, { Component } from "react";
import "./app.scss";
// Components
import Nav from "./components/Nav";

export default class App extends Component {
  render() {
    return (
      <div className="main">
        <Nav />
      </div>
    );
  }
}
