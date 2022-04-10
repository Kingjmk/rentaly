import * as React from 'react';
import {
  AppBar, Button, CssBaseline, Toolbar, Typography, Link, GlobalStyles, Container, Box,
} from '@mui/material';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {Link as RouterLink} from 'react-router-dom';
import {useSelector} from 'react-redux'
import constants from 'utils/constants';
import UserMenu from './UserMenu';

const theme = createTheme({
  palette: {
    background: {
      default: '#f5f7fb',
    },
  },
});

const navbarItems = [];

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
        <Button component={RouterLink} to={'/login'} color='primary' sx={{my: 1, mx: 1.5}}>
          Login
        </Button>
        <Button component={RouterLink} to={'/register'} color="primary" variant='contained' sx={{my: 1, mx: 1.5}}>
          Register
        </Button>
      </React.Fragment>
    )
  } else {
    return (
      <UserMenu user={user}/>
    )
  }
}

export const DefaultAppBar = () => (
  <AppBar
    position='static'
    color='inherit'
    style={{backgroundColor:'#fff'}}
    elevation={0}
    sx={{borderBottom: (theme) => `1px solid ${theme.palette.divider}`}}
  >
    <Container maxWidth="xl">
      <Toolbar sx={{flexWrap: 'wrap'}}>
        <Typography variant='h6' color='inherit' noWrap sx={{flexGrow: 1}}>
          {constants.WEBSITE_NAME}
        </Typography>
        <nav>
          {navbarItems.map(({href, label}, index) => (
            <Link
              key={index}
              variant='button'
              color='text.primary'
              component={RouterLink}
              to={href}
              sx={{my: 1, mx: 1.5}}
            >{label}</Link>
          ))}
        </nav>
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
