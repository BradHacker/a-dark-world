import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './styles/Nav.scss';
// Helpers
import LoginButtons from '../helpers/stateless/LoginButtons';
import LoginForm from '../helpers/stateless/LoginForm';

import { UserContext } from '../UserContext';

export default class Nav extends Component {
  constructor() {
    super();

    this.state = {
      username: '',
      password: '',
      firstName: '',
      lastName: ''
    };

    this.toggleLogin = this.toggleLogin.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  toggleLogin(type) {
    const { showLogin } = this.state;
    this.setState({ showLogin: !showLogin, loginType: type });
  }

  handleInput(key, event) {
    const object = {};
    object[key] = event.target.value;
    this.setState(object);
  }

  render() {
    const { login, signup, toggleSideMenu } = this.props;
    const { loginType, showLogin } = this.state;
    return (
      <UserContext.Consumer>
        {({ user }) => (
          <div className="nav row">
            <div className="title col-auto mx-auto mx-md-0 mb-2 mb-md-0">
              <div className="logo d-inline-block mr-2">
                <i className="fa fa-globe fa-2x logo-icon" />
              </div>
              <h3 className="title-text d-inline font-weight-light">
A Dark World
              </h3>
            </div>
            <div className="col-12 col-md-1" />
            <div className="col-auto mx-auto mr-md-0">
              {!user ? (
                <div className="container login">
                  {showLogin ? (
                    <LoginForm
                      formType={loginType}
                      toggleLogin={this.toggleLogin}
                      state={this.state}
                      handleInput={(key, e) => this.handleInput(key, e)}
                      login={() => login(this.state)}
                      signup={() => signup(this.state)}
                    />
                  ) : (
                    <LoginButtons toggleLogin={this.toggleLogin} />
                  )}
                </div>
              ) : (
                <div className="profile row">
                  <div className="my-auto">
                    <h3 className="hello-user font-weight-light d-inline mr-2">
                      Hello,
                      {' '}
                      {`${user.firstName} ${user.lastName}`}
                    </h3>
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline-light d-inline"
                    onClick={toggleSideMenu}
                  >
                    <i className="fa fa-bars" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </UserContext.Consumer>
    );
  }
}

Nav.propTypes = {
  login: PropTypes.func.isRequired,
  signup: PropTypes.func.isRequired,
  toggleSideMenu: PropTypes.func.isRequired
};
