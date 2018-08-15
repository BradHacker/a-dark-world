import React from 'react';
import PropTypes from 'prop-types';
import './styles/Sidemenu.scss';

const Sidemenu = ({ logout, setPage, isAdmin }) => (
  <div className="col-2 sidemenu">
    <ul className="list-unstyled">
      <li>
        <button type="button" className="btn btn-link btn-block" onClick={() => setPage('home')}>
          home
        </button>
      </li>
      {isAdmin ? (
        <li>
          <button type="button" className="btn btn-link btn-block" onClick={() => setPage('users')}>
            users
          </button>
        </li>
      ) : (
        <div />
      )}
      <li>
        <button type="button" className="btn btn-link btn-block" onClick={logout}>
          signout
        </button>
      </li>
    </ul>
  </div>
);

Sidemenu.propTypes = {
  logout: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired
};

export default Sidemenu;
