import React, { Component } from "react";
import "./app.scss";
import "bootstrap/dist/css/bootstrap.css";
import cookie from "react-cookies";
import axios from "axios";
// Components
import Nav from "./components/Nav";
import Sidemenu from "./components/Sidemenu";

export default class App extends Component {
  constructor() {
    super();

    this.state = {
      userCookie: cookie.load("guid")
    };

    if (this.state.userCookie) {
      axios
        .get(`/api/v1/uids/${this.state.userCookie}`)
        .then(response => this.getUserInfo(response.data.userId));
    }

    this.login = this.login.bind(this);
    this.toggleSideMenu = this.toggleSideMenu.bind(this);
  }

  login(username, password) {
    axios.get(`/api/v1/login?username=${username}&password=${password}`).then(
      response => {
        cookie.save("guid", response.data.cookie, { path: "/" });
        this.setState({ user: response.data.user });
      },
      err => {
        console.error(err);
      }
    );
  }

  logout() {
    cookie.remove("guid");
    window.location.reload();
  }

  getUserInfo(userId) {
    axios.get(`/api/v1/users/${userId}`).then(response => {
      this.setState({ user: response.data });
    });
  }

  toggleSideMenu() {
    this.setState({ showSideMenu: !this.state.showSideMenu });
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <Nav
              login={this.login}
              user={this.state.user}
              toggleSideMenu={this.toggleSideMenu}
            />
          </div>
          {this.state.showSideMenu ? (
            <Sidemenu logout={this.logout} />
          ) : (
            <div />
          )}
        </div>
      </div>
    );
  }
}
