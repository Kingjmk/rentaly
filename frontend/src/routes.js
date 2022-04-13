import React from 'react';
import {UserRoles} from 'utils/common';
import {Navigate, useLocation, useNavigate, useParams} from 'react-router-dom';
import {useSnackbar} from 'notistack';
import {useConfirm} from 'material-ui-confirm';

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
    component: React.lazy(() => import('pages/MapPage')),
    exact: true,
    roles: [],
  },
  apartment_edit: {
    label: 'Edit Apartment',
    path: '/apartments/:id/edit',
    component: React.lazy(() => import('pages/management/apartment/EditPage')),
    exact: true,
    roles: [UserRoles.ADMIN, UserRoles.REALTOR],
  },
  apartment_detail: {
    label: 'Edit Apartment',
    path: '/apartments/:id/view',
    component: React.lazy(() => import('pages/management/apartment/DetailPage')),
    exact: true,
    roles: [UserRoles.ADMIN, UserRoles.REALTOR, UserRoles.CLIENT],
  },
  apartment_add: {
    label: 'New Apartment',
    path: '/apartments/add',
    component: React.lazy(() => import('pages/management/apartment/AddPage')),
    exact: true,
    roles: [UserRoles.ADMIN, UserRoles.REALTOR],
  },
  apartments: {
    label: 'Apartments',
    path: '/apartments',
    component: React.lazy(() => import('pages/management/apartment/ListPage')),
    exact: true,
    roles: [UserRoles.ADMIN, UserRoles.REALTOR],
  },
  user_edit: {
    label: 'Edit User',
    path: '/users/:id/edit',
    component: React.lazy(() => import('pages/management/user/EditPage')),
    exact: true,
    roles: [UserRoles.ADMIN],
  },
  user_add: {
    label: 'New User',
    path: '/users/add',
    component: React.lazy(() => import('pages/management/user/AddPage')),
    exact: true,
    roles: [UserRoles.ADMIN],
  },
  users: {
    label: 'Users',
    path: '/users',
    component: React.lazy(() => import('pages/management/user/ListPage')),
    exact: true,
    roles: [UserRoles.ADMIN],
  },
  not_found: {
    label: 'Not Found',
    path: '*',
    component: React.lazy(() => import('pages/NotFoundPage')),
    exact: false,
    roles: [],
  },
};

const HookInjectorComponent = ({component: Component}) => {
  const props = {
    location: useLocation(),
    navigate: useNavigate(),
    params: useParams(),
    snackbar: useSnackbar(),
    confirm: useConfirm(),
  }

  return (<Component {...props} />)
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

    return (<HookInjectorComponent component={component} />);
  }
}
