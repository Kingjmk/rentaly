import React, {useState, useEffect} from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux'
import routes, {AuthenticateRoute} from 'routes';
import LoadingPage from 'pages/LoadingPage';
import {appInitActions} from 'store/init';


const App = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.authentication.isAuthenticated)
  const [loading, setLoading] = useState(true);

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
      <Routes>
        {routes.map(({component: Component, path, exact, isPublic}, index) => (
          <Route path={`/${path}`} key={index} element={<AuthenticateRoute isAuthenticated={isAuthenticated} isPublic={isPublic} component={Component}/>}/>
        ))}
      </Routes>
    </BrowserRouter>
  );
};

export default App;