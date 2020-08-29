import React, { useEffect } from 'react'
import { Route, Switch, BrowserRouter, useHistory } from 'react-router-dom'

import { useAppContext, setAuth } from '../context/AppContext'
import { OnboardingProvider } from '../context/OnboardingContext'
import { ProfileProvider } from '../context/ProfileContext'

import { HomePage } from '../pages/HomePage'
import { ProfilePage } from './ProfilePage'
import { EditProfilePage } from './EditProfilePage'
import { LoginPage } from '../pages/LoginPage'
import { OnboardingPage } from '../pages/OnboardingPage'
import { PostProtectOnboardCheck, PostProtectInviteCheck } from '../libs/apiLib'


export const AppNavigator: React.FC = () => {

  let history = useHistory()
  const { dispatch } = useAppContext()

  // on mount, handle auth checks
  useEffect(() => {
  
    if (localStorage.getItem('ACCESS_TOKEN') != null) {
      console.log('found access token: ', localStorage.getItem('ACCESS_TOKEN'))
      dispatch(setAuth(true))

      // check if user is onboarded
      // PostProtectOnboardCheck()
      // .then(res => {
      //   if (res.data) {
      //     history.push('/home')
      //   } else {
      //     PostProtectInviteCheck()
      //     .then(res => {
      //       if (!res.data) {
      //         history.push('/home')
      //       }
      //     })
      //     .catch(err => console.log(err))
      //   }
      // })

    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <BrowserRouter>
      <Switch>

        <Route exact path='/'>
          <HomePage />
        </Route>

        <Route exact path='/login'>
          <LoginPage />
        </Route>

        <Route exact path='/onboarding'>
          <OnboardingProvider>
            <OnboardingPage />
          </OnboardingProvider>
        </Route>

        {/* public version of profile */}
        <Route path='/:username'>
          <ProfilePage />
        </Route>

        {/* if own profile, can navigate to edit version of profile */}
        <Route exact path='/edit/:username'>
          <ProfileProvider>
            <EditProfilePage />
          </ProfileProvider>
        </Route>

      </Switch>
    </BrowserRouter>
  )
}