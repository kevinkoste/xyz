import React from 'react'

// presentation/types
import { Component } from '../models/Profile'
// import { EditHeadline } from './Headline'
// import { EditBio } from './Bio'
// import { EditHeadshot } from './Headshot'
// import { EditExperience } from './Experiences'
// import { EditEducation } from '../components/Education'
// import { EditBookshelf } from './Bookshelf'
// import { EditIntegrations } from './Integrations'

import { EditHeadline } from '../components2/Headline'
import { EditBio } from '../components2/Bio'
import { EditHeadshot } from '../components2/Headshot'
import { EditExperience } from '../components2/Experiences'
import { EditEducation } from '../components2/Education'
import { EditBookshelf } from '../components2/Bookshelf'
import { EditIntegrations } from '../components2/Integrations'

// GenerateComponent takes array of objects {id, component, props}[],
// and generates a component from the Components map above
// id, key, are injected as props to each component
type ComponentIndex = {
  [index: string]: any
}
const Components: ComponentIndex = {
  headline: EditHeadline,
  bio: EditBio,
  bookshelf: EditBookshelf,
  headshot: EditHeadshot,
  experiences: EditExperience,
  education: EditEducation,
  integrations: EditIntegrations,
}

export const GenerateEditComponent = (component: Component) => {
  // component exists
  if (typeof Components[component.type] !== 'undefined') {
    return React.createElement(Components[component.type], {
      ...component,
      key: component.id,
    })
  } else {
    // component does not exist
    return <React.Fragment key={component.id} />
  }
}
