import React from 'react'

// presentation/types
import { Component } from '../models/Profile'
import { EditHeadline } from './Headline'
import { EditBio } from './Bio'
import { EditHeadshot } from './Headshot'
import { EditExperiences } from './Experiences'
import { EditBookshelf } from './Bookshelf'
import { EditIntegrations } from './Integrations'

// GenerateComponent takes JSON {id, component, props},
// then generates a component from the Components map above
// id, key, are injected as props to each component
type ComponentIndex = {
	[index: string]: any
}
const Components: ComponentIndex  = {
	headline: EditHeadline,
	bio: EditBio,
	bookshelf: EditBookshelf,
	headshot: EditHeadshot,
	experiences: EditExperiences,
  integrations: EditIntegrations
}

export const GenerateEditComponent = (component: Component) => {
  // component exists
  if (typeof Components[component.type] !== 'undefined') {	
		return React.createElement(Components[component.type], {...component, key:component.id} )
	} else {
		// component does not exist
		return <React.Fragment key={component.id} />
	}
}