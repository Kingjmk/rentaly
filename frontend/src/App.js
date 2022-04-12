import React, {useState, useEffect, Suspense} from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux'
import {routes, AuthenticateRoute} from 'routes';
import LoadingPage from 'pages/LoadingPage';
import {appInitActions} from 'store/init';


const App = () => {
  const dispatch = useDispatch();
  const {isAuthenticated, user: currentUser} = useSelector((state) => state.authentication)
  const [loading, setLoading] = useState(true);

  const routesArray = Object.values(routes);

  useEffect(() => {
    (async () => {
      await appInitActions(dispatch);
      setLoading(false);
    })();

    return () => {/*unmount*/};
  }, []);

  if (loading) return (<LoadingPage />);
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingPage/>}>
        <Routes>
          {routesArray.map(({component: Component, path, exact, roles}, index) => (
            <Route path={path} key={index} element={<AuthenticateRoute isAuthenticated={isAuthenticated} currentUser={currentUser} roles={roles} component={Component}/>}/>
          ))}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
