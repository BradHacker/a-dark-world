import React from 'react';
import PropTypes from 'prop-types';
import './styles/Sidemenu.scss';

const Sidemenu = ({ logout }) => (
  <div className="col-2 sidemenu">
    <ul className="list-unstyled">
      <li>
        <button type="button" className="btn btn-link btn-block" onClick={logout}>
          signout
        </button>
      </li>
    </ul>
  </div>
);

Sidemenu.propTypes = {
  logout: PropTypes.func.isRequired
};

export default Sidemenu;
