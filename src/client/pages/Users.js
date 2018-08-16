/* eslint-disable react/jsx-one-expression-per-line, jsx-a11y/label-has-for */
import React, { Component } from 'react';
import './styles/Users.scss';
import axios from 'axios';
import { UserContext } from '../UserContext';

export default class Users extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      selectedUser: undefined
    };
    this.getUsers();
    this.submitEdit = this.submitEdit.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
  }

  getUsers() {
    axios.get('/api/v1/users').then((response) => {
      this.setState({ users: response.data });
    });
  }

  handleUserChange(event) {
    const { selectedUser } = this.state;
    this.setState({
      selectedUser: { ...selectedUser, [event.target.id]: event.target.value }
    });
    if (event.target.id === 'username') {
      axios
        .put('/api/v1/checkUsername', { username: event.target.value, id: selectedUser._id })
        .then(
          () => {
            this.setState({ duplicateUsername: false });
          },
          (err) => {
            // console.log(err.response.status);
            if (err.response.status === 422) {
              this.setState({ duplicateUsername: true });
            }
          }
        );
    }
  }

  submitEdit(event, currentUser, updateUserFunc) {
    event.preventDefault();
    const { selectedUser } = this.state;
    const modifiedAt = new Date();
    const newUser = {
      ...selectedUser,
      lastModified: modifiedAt,
      modifiedBy: currentUser
    };
    this.setState({ errors: undefined });
    axios.put(`/api/v1/users/${selectedUser._id}`, newUser).then(
      (response) => {
        this.getUsers();
        this.setState({ selectedUser: undefined });
        if (currentUser._id === response.data._id) {
          updateUserFunc(newUser);
        }
      },
      (err) => {
        if (err.response.status === 422) {
          this.setState({ ...err.response.data });
        } else {
          this.setState({ errors: { message: 'An unkown error has occurred' } });
        }
      }
    );
  }

  delete(userIndex) {
    const { users } = this.state;
    const updatedUsers = users.slice();
    updatedUsers[userIndex].reallySure = (updatedUsers[userIndex].reallySure || 0) + 1;
    this.setState({ users: updatedUsers });
    if (updatedUsers[userIndex].reallySure === 2) {
      this.deleteUserFinal(updatedUsers[userIndex]);
    }
  }

  deleteUserFinal(user) {
    axios
      .delete(`/api/v1/users/${user._id}`)
      .then(() => this.getUsers(), err => this.setState({ errors: err }));
  }

  cancelDelete(userIndex) {
    const { users } = this.state;
    const updatedUsers = users.slice();
    delete updatedUsers[userIndex].reallySure;
    this.setState({ users: updatedUsers });
  }

  render() {
    const {
      users, selectedUser, errors, duplicateUsername
    } = this.state;
    return (
      <UserContext.Consumer>
        {({ user, updateUser }) => (
          <React.Fragment>
            {errors && errors.message ? (
              <div className="alert alert-danger">
                {errors.message}
                <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            ) : (
              <div />
            )}
            {selectedUser ? (
              <form onSubmit={event => this.submitEdit(event, user, updateUser)} className="form">
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    className={`form-control ${duplicateUsername ? 'is-invalid' : 'is-valid'}`}
                    id="username"
                    aria-describedby="Username"
                    placeholder="Username"
                    value={selectedUser.username}
                    onChange={this.handleUserChange}
                    required
                  />
                  <div className="invalid-feedback">This Username Is Taken.</div>
                  <div className="valid-feedback">This Username Is Free To Use!</div>
                </div>
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    className={`form-control ${
                      selectedUser.firstName === '' ? 'is-invalid' : 'is-valid'
                    }`}
                    id="firstName"
                    placeholder="First Name"
                    value={selectedUser.firstName}
                    onChange={this.handleUserChange}
                    required
                  />
                  <div className="invalid-feedback">Please provide a first name.</div>
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    className={`form-control ${
                      selectedUser.lastName === '' ? 'is-invalid' : 'is-valid'
                    }`}
                    id="lastName"
                    placeholder="Last Name"
                    value={selectedUser.lastName}
                    onChange={this.handleUserChange}
                    required
                  />
                  <div className="invalid-feedback">Please provide a last name.</div>
                </div>
                <div className="btn-group full-width" role="group" aria-label="Basic example">
                  <button type="submit" className="btn btn-outline-success">
                    Submit
                  </button>
                  <button type="button" className="btn btn-outline-danger">
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <table className="table table-dark users-table">
                <thead>
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Username</th>
                    <th scope="col">First Name</th>
                    <th scope="col">Last Name</th>
                    <th scope="col">Created At</th>
                    <th scope="col">Last Login</th>
                    <th scope="col">Last Modified</th>
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                  {users.map((_user, index) => (
                    <tr key={`user${_user._id}`}>
                      <th scope="row">{_user._id}</th>
                      <td>{_user.username}</td>
                      <td>{_user.firstName}</td>
                      <td>{_user.lastName}</td>
                      <td>{`${new Date(_user.createdAt).toLocaleDateString()} ${new Date(
                        _user.createdAt
                      ).toLocaleTimeString()}`}
                      </td>
                      <td>
                        {_user.lastLogin
                          && `${new Date(_user.lastLogin).toLocaleDateString()} ${new Date(
                            _user.lastLogin
                          ).toLocaleTimeString()}`}
                        {!_user.lastLogin && 'Never'}
                      </td>
                      <td>
                        {_user.lastModified
                          && `${new Date(_user.lastModified).toLocaleDateString()} ${new Date(
                            _user.lastModified
                          ).toLocaleTimeString()}`}
                        {!_user.lastModified && 'Never'}
                      </td>
                      <td>
                        {_user._id !== user._id && !_user.reallySure ? (
                          <div
                            className="btn-group btn-group-sm"
                            role="group"
                            aria-label="User Actions"
                          >
                            <button
                              type="button"
                              className="btn btn-outline-warning"
                              title="Edit"
                              onClick={() => this.setState({ selectedUser: _user })}
                            >
                              <i className="fa fa-pencil-alt" />
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-danger"
                              title="Delete"
                              onClick={() => this.delete(index)}
                            >
                              <i className="fa fa-trash" />
                            </button>
                          </div>
                        ) : (
                          <div
                            className="btn-group btn-group-sm"
                            role="group"
                            aria-label="User Actions"
                          >
                            <button
                              type="button"
                              className={`btn btn-sm btn-outline-${
                                _user.reallySure ? 'danger' : 'warning'
                              }`}
                              title={`${_user.reallySure ? 'Are you sure?' : 'Edit'}`}
                              onClick={() => {
                                if (_user.reallySure) {
                                  this.delete(index);
                                } else {
                                  this.setState({ selectedUser: _user });
                                }
                              }}
                            >
                              {_user.reallySure ? (
                                <i className="fa fa-trash" />
                              ) : (
                                <i className="fa fa-pencil-alt" />
                              )}
                            </button>
                            {_user.reallySure && (
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-light"
                                title="Cancel"
                                onClick={() => this.cancelDelete(index)}
                              >
                                <i className="fa fa-times" />
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </React.Fragment>
        )}
      </UserContext.Consumer>
    );
  }
}
