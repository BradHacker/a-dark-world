import React from 'react';

export const defaultUser = {
  user: {
    username: '',
    fisrtName: '',
    lastName: '',
    lastLogin: ''
  },
  updateUser: () => {
    console.log('Replace the updateUser method');
  }
};

export const UserContext = React.createContext(defaultUser);
