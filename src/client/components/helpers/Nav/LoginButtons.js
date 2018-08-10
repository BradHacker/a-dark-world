import React, { Component } from "react";

export default class LoginButtons extends Component {
  render() {
    return (
      <div
        className="btn-group login-options"
        role="group"
        aria-label="Login Options"
      >
        <button
          className="btn btn-outline-light"
          onClick={this.props.toggleLogin}
        >
          Login
        </button>
        <button className="btn btn-outline-light text-right">Sign Up</button>
      </div>
    );
  }
}
