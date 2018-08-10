import React, { Component } from "react";
import "./styles/Sidemenu.scss";

export default class Sidemenu extends Component {
  render() {
    return (
      <div className="col-2 sidemenu">
        <ul className="list-unstyled">
          <li>
            <button
              className="btn btn-link btn-block"
              onClick={this.props.logout}
            >
              signout
            </button>
          </li>
        </ul>
      </div>
    );
  }
}
