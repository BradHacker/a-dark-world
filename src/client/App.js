import React, { Component } from 'react';
import './app.scss';
import cookie from 'react-cookies';
import axios from 'axios';
// Main pages
import Home from './pages/Home';
import Landing from './pages/Landing';
import Users from './pages/Users';
// Components
import Nav from './components/Nav';
import Sidemenu from './components/Sidemenu';

import { UserContext, defaultUser } from './UserContext';

export default class App extends Component {
  constructor() {
    super();

    this.state = {
      sessionId: cookie.load('sessionId'),
      currentPage: '',
      userContext: defaultUser
    };

    const { sessionId } = this.state;
    if (sessionId) {
      axios.get(`/api/v1/sessions/${sessionId}`).then((response) => {
        this.setUser(response.data.userId);
      });
    }

    this.login = this.login.bind(this);
    this.signup = this.signup.bind(this);
    this.logout = this.logout.bind(this);
    this.toggleSideMenu = this.toggleSideMenu.bind(this);
    this.setPage = this.setPage.bind(this);
    this.updateUser = this.updateUser.bind(this);
  }

  componentDidMount() {
    const { userContext } = this.state;
    this.setState({ userContext: { ...userContext, updateUser: this.updateUser } });
  }

  setUser(userId) {
    axios.get(`/api/v1/users/${userId}`).then((response) => {
      const { userContext } = this.state;
      this.setState({ userContext: { ...userContext, user: response.data } });
    });
  }

  setPage(page) {
    this.setState({ currentPage: page });
    this.toggleSideMenu();
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
          this.setUser(response.data.userId);
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
          this.setUser(response.data.insertedId);
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
    const { userContext } = this.state;
    const { user } = userContext;
    if (!user) return false;
    return user.isAdmin === true;
  }

  updateUser(user) {
    const { userContext } = this.state;
    this.setState({ userContext: { ...userContext, user: { ...user } } });
  }

  render() {
    const {
      user, showSideMenu, currentPage, userContext
    } = this.state;
    let visiblePage = null;
    switch (currentPage) {
      case 'users':
        visiblePage = <Users user={user} />;
        break;
      case 'home':
        visiblePage = <Home />;
        break;
      default:
        visiblePage = <Landing />;
    }
    return (
      <UserContext.Provider value={userContext}>
        <div className="container-fluid">
          <div className="row">
            <div className="col">
              <Nav login={this.login} signup={this.signup} toggleSideMenu={this.toggleSideMenu} />
              <div className="container">
                {visiblePage}
              </div>
            </div>
            {showSideMenu ? (
              <Sidemenu logout={this.logout} isAdmin={this.isAdmin()} setPage={this.setPage} />
            ) : (
              <div />
            )}
          </div>
        </div>
      </UserContext.Provider>
    );
  }
}
