import React, {useContext} from 'react';
import {AuthContext} from './hoc/AuthContextProvider';
import Layout from './hoc/Layout/Layout';
import {Switch, Route, Redirect} from 'react-router-dom';
import BloodBanks from './containers/BloodBanks/BloodBanks';
import Auth from './containers/Auth/Auth';

const App = () => {
  const {authState} = useContext(AuthContext);
  const {isAuthenticated} = authState;
  const routes = !isAuthenticated ? (
    <Switch>
      <Route exact path='/' component={Auth} />
      <Redirect to="/" />
    </Switch>
  ):(
    <Switch>
      <Route path='/bloodBanks' component={BloodBanks} />
      <Redirect to="/bloodBanks" />
    </Switch>
  );
  return (
    <Layout>
      {routes}
    </Layout>
  );
};

export default App;
