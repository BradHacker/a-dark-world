import React from 'react';
import PropTypes from 'prop-types';

const LoginForm = ({
  toggleLogin, formType, handleInput, state, login, signup
}) => (
  <div className="form-inline">
    <div className="form-group">
      <button type="button" className="btn btn-outline-light" onClick={toggleLogin}>
        <i className="fa fa-times" />
      </button>
    </div>
    {formType === 0 ? (
      <div>
        <input
          className="form-control"
          type="text"
          onChange={e => handleInput('username', e)}
          value={state.username}
          placeholder="Username"
        />
        <input
          className="form-control"
          type="password"
          onChange={e => handleInput('password', e)}
          value={state.password}
          placeholder="Password"
        />
      </div>
    ) : (
      <div>
        <div className="form-group">
          <input
            className="form-control"
            type="text"
            onChange={e => handleInput('username', e)}
            value={state.username}
            placeholder="Username"
          />
        </div>
        <div className="form-group">
          <input
            className="form-control"
            type="password"
            onChange={e => handleInput('password', e)}
            value={state.password}
            placeholder="Password"
          />
        </div>
      </div>
    )}
    {formType === 1 ? (
      <div>
        <div className="form-group">
          <input
            className="form-control"
            type="text"
            onChange={e => handleInput('firstName', e)}
            value={state.firstname}
            placeholder="First Name"
          />
        </div>
        <div className="form-group">
          <input
            className="form-control"
            type="text"
            onChange={e => handleInput('lastName', e)}
            value={state.lastname}
            placeholder="Last Name"
          />
        </div>
      </div>
    ) : (
      <div />
    )}
    <div className="form-group">
      <button
        type="button"
        className="btn btn-outline-light"
        onClick={formType === 0 ? login : signup}
      >
        {formType === 0 ? 'Login' : 'Sign Up'}
      </button>
    </div>
  </div>
);

LoginForm.propTypes = {
  toggleLogin: PropTypes.func.isRequired,
  formType: PropTypes.number.isRequired,
  handleInput: PropTypes.func.isRequired,
  state: PropTypes.object.isRequired,
  login: PropTypes.func.isRequired,
  signup: PropTypes.func.isRequired
};

export default LoginForm;
