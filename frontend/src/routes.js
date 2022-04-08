import React from 'react';
import {Navigate} from 'react-router-dom';
import LoginPage from 'pages/auth/LoginPage';
import LogoutPage from 'pages/auth/LogoutPage';
import DashboardPage from 'pages/DashboardPage';

export const IndexRedirect = () => (<Navigate to={{pathname: '/dashboard'}}/>);

export const routes = [
  {
    path: '',
    component: IndexRedirect,
    exact: false,
    isPublic: true,
  },
  {
    path: 'login',
    component: LoginPage,
    exact: true,
    isPublic: true,
  },
  {
    path: 'logout',
    component: LogoutPage,
    exact: true,
    isPublic: false,
  },
  {
    path: 'dashboard',
    component: DashboardPage,
    exact: true,
    isPublic: true,
  },
];

export class AuthenticateRoute extends React.Component {
  // Private route restrict to access public pages after login.
  render() {
    let {isAuthenticated, isPublic, location, component: Component} = this.props;
    if (!isPublic && !isAuthenticated) {
      return (
        <Navigate
          to={{
            pathname: '/login',
            state: {from: location},
          }}
        />
      )
    }

    return (
      <Component/>
    );
  }
}

export default routes;
