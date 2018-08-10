import React, { Component } from "react";
import "./styles/Nav.scss";
//Helpers
import LoginButtons from "./helpers/Nav/LoginButtons";
import LoginForm from "./helpers/Nav/LoginForm";

export default class Nav extends Component {
  constructor() {
    super();

    this.state = {
      usernameInput: "",
      passwordInput: ""
    };

    this.toggleLogin = this.toggleLogin.bind(this);
    this.handleUsername = this.handleUsername.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
  }

  toggleLogin() {
    this.setState({ showLogin: !this.state.showLogin });
  }

  handleUsername(e) {
    this.setState({ usernameInput: e.target.value });
  }

  handlePassword(e) {
    this.setState({ passwordInput: e.target.value });
  }

  render() {
    return (
      <div className="nav">
        <div className="title">
          <div className="logo d-inline-block mr-2">
            <i className="fa fa-globe fa-2x logo-icon" />
          </div>
          <h3 className="title-text d-inline font-weight-light">
            A Dark World
          </h3>
        </div>
        {!this.props.user ? (
          <div className="login ml-auto">
            {this.state.showLogin ? (
              <LoginForm
                toggleLogin={this.toggleLogin}
                handleUsername={this.handleUsername}
                handlePassword={this.handlePassword}
                usernameInput={this.state.usernameInput}
                passwordInput={this.state.passwordInput}
                login={() =>
                  this.props.login(
                    this.state.usernameInput,
                    this.state.passwordInput
                  )
                }
              />
            ) : (
              <LoginButtons toggleLogin={this.toggleLogin} />
            )}
          </div>
        ) : (
          <div className="profile ml-auto row">
            <div className="my-auto">
              <h3 className="hello-user font-weight-light d-inline mr-2">
                Hello,{" "}
                {`${this.props.user.first_name} ${this.props.user.last_name}`}
              </h3>
            </div>
            <button
              className="btn btn-outline-light d-inline"
              onClick={this.props.toggleSideMenu}
            >
              <i className="fa fa-bars" />
            </button>
          </div>
        )}
      </div>
    );
  }
}
