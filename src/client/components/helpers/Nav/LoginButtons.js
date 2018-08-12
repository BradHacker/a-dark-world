import React from 'react';
import PropTypes from 'prop-types';

const LoginButtons = ({ toggleLogin }) => (
  <div className="btn-group login-options" role="group" aria-label="Login Options">
    <button type="button" className="btn btn-outline-light" onClick={() => toggleLogin(0)}>
      Login
    </button>
    <button
      type="button"
      className="btn btn-outline-light text-right"
      onClick={() => toggleLogin(1)}
    >
      Sign Up
    </button>
  </div>
);

LoginButtons.propTypes = {
  toggleLogin: PropTypes.func.isRequired
};

export default LoginButtons;
