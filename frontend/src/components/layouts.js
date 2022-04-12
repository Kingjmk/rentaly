import * as React from 'react';
import {
  AppBar, Button, CssBaseline, Toolbar, Typography, Link, GlobalStyles, Container, Box,
} from '@mui/material';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {Link as RouterLink} from 'react-router-dom';
import {useSelector} from 'react-redux'
import constants from 'utils/constants';
import {routes} from 'routes';
import UserMenu from './UserMenu';

const theme = createTheme({
  palette: {
    background: {
      default: '#f5f7fb',
    },
  },
});

const navbarItems = [
  routes.apartments,
];

const NavbarItems = ({isAuthenticated, user}) => {
  const items = [];

  for (const {roles, path, label} of navbarItems) {
    if (!isAuthenticated || roles.includes(user.roles)) continue;

    items.push({
      href: path,
      label: label,
    })
  }

  return (
    <nav>
      {items.map(({href, label}, index) => (
        <Link
          key={index}
          variant='button'
          color='text.primary'
          component={RouterLink}
          to={href}
          sx={{my: 1, mx: 1.5}}
          style={{textDecoration: 'none'}}
        >{label}</Link>
      ))}
    </nav>
  );
};


const Copyright = (props) => (
  <Typography variant='body2' color='text.secondary' align='center' {...props}>
    {'Copyright © '}
    <Link color='inherit' href={constants.AUTHOR_LINK}>
      {constants.WEBSITE_NAME}
    </Link>{' '}
    {new Date().getFullYear()}
    {'.'}
  </Typography>
);

const UserButtons = () => {
  const {isAuthenticated, user} = useSelector((state) => state.authentication);
  if (!isAuthenticated) {
    return (
      <React.Fragment>
        <NavbarItems isAuthenticated={isAuthenticated} user={user}/>
        <Button component={RouterLink} to={'/login'} color='primary' sx={{my: 1, mx: 1.5}}>
          Login
        </Button>
        <Button component={RouterLink} to={'/register'} color="primary" variant='contained' sx={{my: 1, mx: 1.5}}>
          Register
        </Button>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <NavbarItems isAuthenticated={isAuthenticated} user={user}/>
      <UserMenu user={user}/>
    </React.Fragment>
  );
}

export const DefaultAppBar = ({maxWidth = 'xl'}) => (
  <AppBar
    position='static'
    color='inherit'
    style={{backgroundColor:'white'}}
    elevation={0}
    sx={{borderBottom: (theme) => `1px solid ${theme.palette.divider}`}}
  >
    <Container maxWidth={maxWidth}>
      <Toolbar sx={{flexWrap: 'wrap'}}>
        <Box sx={{flexGrow: 1}}>
          <Typography component={RouterLink} to={'/dashboard'} variant='h6' color='inherit' noWrap style={{textDecoration: 'none'}}>
            {constants.WEBSITE_NAME}
          </Typography>
        </Box>
        <UserButtons/>
      </Toolbar>
    </Container>
  </AppBar>
);

export const PlainLayout = ({hasFooter = false, hasHeader = false, children}) => (
  <ThemeProvider theme={theme}>
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
    }}>
      <CssBaseline/>
      <GlobalStyles styles={{ul: {margin: 0, padding: 0, listStyle: 'none'}}}/>

      {hasHeader && <DefaultAppBar/>}

      {/* START OF TEMPLATE */}
      {children}
      {/* END OF TEMPLATE */}

      {/* Footer */}
      {hasFooter &&
      <Container
        maxWidth='md'
        component='footer'
        sx={{
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          mt: 8,
          py: [3, 6],
        }}
      >
        <Copyright sx={{mt: 5}}/>
      </Container>
      }
      {/* End footer */}
    </Box>
  </ThemeProvider>
);


export const DefaultLayout = ({hasFooter = true, children}) => (
  <PlainLayout hasFooter={hasFooter} hasHeader={true}>
    {/* START OF TEMPLATE */}
    {children}
    {/* END OF TEMPLATE */}
  </PlainLayout>
);
