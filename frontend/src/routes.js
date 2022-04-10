import React from 'react';
import {Navigate, useNavigate, useLocation} from 'react-router-dom';
import RegisterPage from 'pages/auth/RegisterPage';
import LoginPage from 'pages/auth/LoginPage';
import LogoutPage from 'pages/auth/LogoutPage';
import DashboardPage from 'pages/DashboardPage';
import MapPage from 'pages/core/MapPage';

export const IndexRedirect = () => (<Navigate to={'/dashboard'}/>);

export const routes = [
  {
    path: '',
    component: IndexRedirect,
    exact: false,
    isPublic: true,
  },
  {
    path: 'register',
    component: RegisterPage,
    exact: true,
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
  {
    path: 'map',
    component: MapPage,
    exact: true,
    isPublic: true,
  },
];

const RoutingComponent = ({component: Component}) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (<Component location={location} navigate={navigate} />)
}

export class AuthenticateRoute extends React.Component {
  // Private route restrict to access public pages after login.
  render() {
    let {isAuthenticated, isPublic, location, component} = this.props;
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

    return (<RoutingComponent component={component} />);
  }
}

export default routes;
