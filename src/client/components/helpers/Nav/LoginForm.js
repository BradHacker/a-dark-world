import React, { Component } from "react";

export default class LoginForm extends Component {
  render() {
    return (
      <form className="form-inline">
        <button
          type="button"
          className="btn btn-outline-light"
          onClick={this.props.toggleLogin}
        >
          <i className="fa fa-times" />
        </button>
        <input
          className="form-control"
          type="text"
          onChange={this.props.handleUsername}
          value={this.props.usernameInput}
        />
        <input
          className="form-control"
          type="password"
          onChange={this.props.handlePassword}
          value={this.props.passwordInput}
        />
        <button
          type="button"
          className="btn btn-outline-light"
          onClick={this.props.login}
        >
          Login
        </button>
      </form>
    );
  }
}
