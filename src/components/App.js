// ALL FIREBASE AUTHENTICATION FUNCTIONALITY BASED ON THE TUTORIAL BY WEB DEV SIMPLIFIED
// THIS TUTORIAL CAN BE FOUND AT https://www.youtube.com/watch?v=PKwu15ldZ7k

import React from 'react'
import Signup from "./Signup"
import Dashboard from "./Dashboard"
import Login from "./Login"
import { AuthProvider } from '../contexts/AuthContext'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import ForgotPassword from './ForgotPassword'
import UpdateProfile from './UpdateProfile'
import BoardSelect from './BoardSelect'
import Board from './Board'

function App() {
  return (
    <div className="w-100 contains-all">
      <Router>
        <AuthProvider>
          <Switch>
            <PrivateRoute exact path='/' component={BoardSelect} />
            <PrivateRoute path='/dashboard' component={Dashboard} />
            <PrivateRoute path='/boards/:id' component={Board} />
            <PrivateRoute path='/update-profile' component={UpdateProfile} />
            <Route path='/signup' component={Signup} />
            <Route path='/login' component={Login} />
            <Route path='/forgot-password' component={ForgotPassword} />
          </Switch>
        </AuthProvider>
      </Router>
    </div>
  )
}

export default App
