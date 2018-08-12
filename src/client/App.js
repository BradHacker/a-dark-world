import React, { Component } from 'react';
import './app.scss';
import 'bootstrap/dist/css/bootstrap.css';
import cookie from 'react-cookies';
import axios from 'axios';
// Components
import Nav from './components/Nav';
import Sidemenu from './components/Sidemenu';

export default class App extends Component {
  constructor() {
    super();

    this.state = {
      sessionId: cookie.load('sessionId')
    };

    const { sessionId } = this.state;
    if (sessionId) {
      axios
        .get(`/api/v1/sessions/${sessionId}`)
        .then(response => this.getUserInfo(response.data.userId));
    }

    this.login = this.login.bind(this);
    this.signup = this.signup.bind(this);
    this.logout = this.logout.bind(this);
    this.toggleSideMenu = this.toggleSideMenu.bind(this);
  }

  getUserInfo(userId) {
    axios.get(`/api/v1/users/${userId}`).then((response) => {
      this.setState({ user: response.data });
    });
  }

  login(state) {
    axios
      .post('/api/v1/login', {
        username: state.username,
        password: state.password
      })
      .then(
        (response) => {
          cookie.save('sessionId', response.data.sessionId, { path: '/' });
          this.setState({ user: response.data.user });
        },
        (err) => {
          console.error(err);
        }
      );
  }

  signup(state) {
    axios
      .post('/api/v1/signup', {
        username: state.username,
        password: state.password,
        firstName: state.firstName,
        lastName: state.lastName
      })
      .then(
        (response) => {
          cookie.save('sessionId', response.data.sessionId, { path: '/' });
          this.getUserInfo(response.data.insertedId);
        },
        (err) => {
          console.error(err);
        }
      );
  }

  logout() {
    this.setState({ user: undefined, sessionId: undefined });
    cookie.remove('sessionId');
    window.location.reload();
  }

  toggleSideMenu() {
    const { showSideMenu } = this.state;
    this.setState({ showSideMenu: !showSideMenu });
  }

  isAdmin() {
    const { user } = this.state;
    return user.isAdmin === true;
  }

  render() {
    const { user, showSideMenu } = this.state;
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <Nav
              login={this.login}
              signup={this.signup}
              user={user}
              toggleSideMenu={this.toggleSideMenu}
            />
          </div>
          {showSideMenu ? <Sidemenu logout={this.logout} isAdmin={this.isAdmin()} /> : <div />}
        </div>
      </div>
    );
  }
}
