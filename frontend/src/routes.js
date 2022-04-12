import React from 'react';
import {Navigate, useNavigate, useLocation, useParams} from 'react-router-dom';
import {UserRoles} from 'utils/common';
export const IndexRedirect = () => (<Navigate to={'/dashboard'}/>);
export const LoginRedirect = ({location}) => (<Navigate to={{pathname: '/login', state: {from: location}}}/>);

export const routes = {
  index: {
    label: 'Index',
    path: '',
    component: IndexRedirect,
    exact: false,
    roles: [],
  },
  register: {
    label: 'Register',
    path: 'register',
    component: React.lazy(() => import('pages/auth/RegisterPage')),
    exact: true,
    roles: [],
  },
  login: {
    label: 'Login',
    path: '/login',
    component: React.lazy(() => import('pages/auth/LoginPage')),
    exact: true,
    roles: [],
  },
  logout: {
    label: 'Logout',
    path: '/logout',
    component: React.lazy(() => import('pages/auth/LogoutPage')),
    exact: true,
    roles: [UserRoles.ADMIN, UserRoles.REALTOR, UserRoles.CLIENT],
  },
  dashboard: {
    label: 'Dashboard',
    path: '/dashboard',
    component: React.lazy(() => import('pages/DashboardPage')),
    exact: true,
    roles: [],
  },
  map: {
    label: 'Map',
    path: '/map',
    component: React.lazy(() => import('pages/core/MapPage')),
    exact: true,
    roles: [],
  },
  apartment_edit: {
    label: 'Edit Apartment',
    path: '/apartments/:id/edit',
    component: React.lazy(() => import('pages/core/apartment/EditPage')),
    exact: true,
    roles: [UserRoles.ADMIN, UserRoles.REALTOR],
  },
  apartment_add: {
    label: 'New Apartment',
    path: '/apartments/add',
    component: React.lazy(() => import('pages/core/apartment/AddPage')),
    exact: true,
    roles: [UserRoles.ADMIN, UserRoles.REALTOR],
  },
  apartments: {
    label: 'Apartments',
    path: '/apartments',
    component: React.lazy(() => import('pages/core/apartment/ListPage')),
    exact: true,
    roles: [UserRoles.ADMIN, UserRoles.REALTOR],
  },
  not_found: {
    label: 'Not Found',
    path: '*',
    component: React.lazy(() => import('pages/NotFoundPage')),
    exact: false,
    roles: [],
  },
};

const RoutingComponent = ({component: Component}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();

  return (<Component location={location} navigate={navigate} params={params} />)
}

export class AuthenticateRoute extends React.Component {
  // Private route restrict to access public pages after login.
  render() {
    let {isAuthenticated, currentUser, roles, location, component} = this.props;
    if (roles.length !== 0) {
      if (!isAuthenticated) {
        return (<LoginRedirect location={location}/>);
      }

      if (!roles.includes(currentUser.role)) {
        // TODO: show message or something
        return (<LoginRedirect location={location}/>);
      }
    }

    return (<RoutingComponent component={component} />);
  }
}
