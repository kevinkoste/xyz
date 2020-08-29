import React, { createContext, useReducer, useContext, Dispatch } from 'react'

import { Profile, EmptyProfile } from '../models/Profile'

type StateType = {
  profile: Profile,
  editing: boolean,
}

const initialState: StateType = {
  profile: EmptyProfile,
  editing: false,
}

type ProfileContextType = {
  profileState: StateType,
  profileDispatch: Dispatch<Action>
}

const ProfileContext = createContext<ProfileContextType>({
  profileState: initialState,
  profileDispatch: () => null
})

// Action constants
const UPDATE_PROFILE = "UPDATE_PROFILE"
const TOGGLE_EDITING = "TOGGLE_EDITING"
const UPDATE_COMPONENT = "UPDATE_COMPONENT"


// Valid action types
type Action =
 | { type: "UPDATE_PROFILE", profile: Profile }
 | { type: "TOGGLE_EDITING" }
 | { type: "UPDATE_COMPONENT", component: any }



// Action creators
export const updateProfile = (profile: Profile): Action => {
  return { type: UPDATE_PROFILE, profile: profile}
}

export const toggleEditing = (): Action => {
  return { type: TOGGLE_EDITING }
}

export const updateComponent = (component: any): Action => {
  return { type: UPDATE_COMPONENT, component: component}
}


// Reducer
const ProfileReducer = (state: StateType, action: Action) => {
  switch (action.type) {

    case UPDATE_PROFILE:
      return {
        ...state,
        profile: action.profile
      }

    case TOGGLE_EDITING:
      return {
        ...state,
        editing: !state.editing
      }


    case UPDATE_COMPONENT:
      if (state.profile.components.find(component => component.id === action.component.id) === undefined) {
        // component doesn't exist, add it
        return {
          ...state,
          profile: {
            ...state.profile,
            components: [...state.profile.components, action.component]
          }
        }
      } else {
        // component exists, update it!
        return {
          ...state,
          profile: {
            ...state.profile,
            components: state.profile.components.map(component => (component.id === action.component.id) ? action.component : component )
          }
        }
      }

    default:
      return state
  }
}

export const ProfileProvider: React.FC = ({ children }) => {

  const [profileState, profileDispatch] = useReducer(ProfileReducer, initialState)

  return (
    <ProfileContext.Provider value={{profileState, profileDispatch}}>
      {children}
    </ProfileContext.Provider>
  )
}

export const useProfileContext = () => {
  return useContext(ProfileContext)
}
