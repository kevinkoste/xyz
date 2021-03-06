import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import imageCompression from 'browser-image-compression'
import ClipLoader from 'react-spinners/ClipLoader'

import { useMobile } from '../libs/hooks'
import { useAppContext, setUsername, setOnboarded } from '../context/AppContext'
import {
  useOnboardingContext,
  updateUsername,
  updateComponent,
} from '../context/OnboardingContext'
import { Div, H1, H2, TextArea, Img, Button } from './Base'

import {
  PostProtectProfileImage,
  GetPublicUsernameAvailability,
  PostProtectComponents,
  PostProtectUsername,
} from '../libs/api'
import {
  NameComponent,
  HeadlineComponent,
  HeadshotComponent,
} from '../models/Profile'

// USERNAME //
type OnboardingUsernameProps = {
  id: number
  title: string
  placeholder: string
  onForwardClick: any
  setShowButton: any
}
export const OnboardingUsername: React.FC<OnboardingUsernameProps> = ({
  id,
  title,
  placeholder,
  onForwardClick,
  setShowButton,
}) => {
  const { onboardingState, onboardingDispatch } = useOnboardingContext()
  const [username, setUsername] = useState<string>('')
  const [started, setStarted] = useState<boolean>(false)
  const [valid, setValid] = useState<boolean>(false)
  const [available, setAvailable] = useState<boolean>(true)

  useEffect(() => {
    // if returning to component, populate input
    const username = onboardingState.profile.username
    if (username !== '') {
      setValid(true)
      setShowButton(true)
      setUsername(username)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // checks availability on a timeout
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (username !== '' && username !== placeholder) {
        GetPublicUsernameAvailability(username)
          .then((res) => {
            // we do all of our validation here
            setAvailable(res.data)
            if (res.data === false) {
              setShowButton(false)
            } else if (username === '') {
              setValid(false)
              setShowButton(false)
            } else {
              setValid(true)
              setShowButton(true)
            }
          })
          .catch((err) => console.log(err))
      }
    }, 200)
    return () => clearTimeout(delayDebounceFn)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username])

  // dispatch the updated text to OnboardingContext state
  const onBlur = () => {
    if (valid && available) {
      onboardingDispatch(updateUsername(username))
    }
  }

  const onChange = (event: any) => {
    setStarted(true)
    setShowButton(false)
    const filteredText = event.target.value.replace(/[^a-zA-Z0-9]/g, '')
    setUsername(filteredText)
    if (filteredText !== '') {
      setValid(true)
    } else {
      setValid(false)
    }
  }

  // enter key advances form
  const onKeyDown = (event: any) => {
    if (event.key === 'Enter' && valid && available) {
      event.preventDefault()
      onboardingDispatch(updateUsername(username))
      onForwardClick()
    }
  }

  return (
    <OnboardingScreenContainer column width={12}>
      <OnboardingTitleText>{title}</OnboardingTitleText>
      <OnboardingTextArea
        autoFocus
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        autoCapitalize="none"
        style={{ textTransform: 'lowercase' }}
        value={username}
      />
      {!available && <H2>That username is taken</H2>}
      {started && !valid && <H2>Please enter a username</H2>}
    </OnboardingScreenContainer>
  )
}

// NAME //
type OnboardingNameProps = {
  title: string
  placeholder: string
  onForwardClick: any
  setShowButton: any
}
export const OnboardingName: React.FC<OnboardingNameProps> = ({
  title,
  placeholder,
  onForwardClick,
  setShowButton,
}) => {
  const { onboardingState, onboardingDispatch } = useOnboardingContext()
  const [started, setStarted] = useState<boolean>(false)
  const [valid, setValid] = useState<boolean>(false)
  // component.props.name is basically our "textInput"
  const [component, setComponent] = useState<NameComponent>({
    id: uuidv4().toString(),
    type: 'name',
    props: {
      name: '',
    },
  })

  // if returning to component, populate input
  useEffect(() => {
    const foundComponent = onboardingState.profile.components.find(
      (component) => component.type === 'name'
    )
    if (foundComponent) {
      setValid(true)
      setShowButton(true)
      // @ts-ignore
      const name = foundComponent.props.name
      if (name !== '') {
        setComponent({
          ...component,
          props: { ...component.props, name: name },
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // dispatch the updated text to OnboardingContext state
  const onBlur = () => {
    onboardingDispatch(updateComponent(component))
  }

  // updates textinput (text that is displayed) and component
  const onChange = (event: any) => {
    setStarted(true)

    const filteredText: string = event.target.value.replace(
      /[^a-zA-Z0-9\s]/g,
      ''
    )
    setComponent({
      ...component,
      props: { ...component.props, name: filteredText },
    })

    if (filteredText.split(' ').length > 1) {
      setValid(true)
      setShowButton(true)
    } else {
      setValid(false)
      setShowButton(false)
    }
  }

  // enter key advances form
  const onKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      onboardingDispatch(updateComponent(component))
      onForwardClick()
    }
  }

  return (
    <OnboardingScreenContainer column width={12}>
      <OnboardingTitleText>{title}</OnboardingTitleText>
      <OnboardingTextArea
        autoFocus
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        value={component.props.name}
        style={{ textTransform: 'capitalize' }}
      />
      {started && !valid && <H2>Please enter your first and last name</H2>}
    </OnboardingScreenContainer>
  )
}

// HEADLINE //
type OnboardingHeadlineProps = {
  title: string
  placeholder: string
  onForwardClick: any
  setShowButton: any
}
export const OnboardingHeadline: React.FC<OnboardingHeadlineProps> = ({
  title,
  placeholder,
  onForwardClick,
  setShowButton,
}) => {
  const { onboardingState, onboardingDispatch } = useOnboardingContext()
  const [started, setStarted] = useState<boolean>(false)
  const [valid, setValid] = useState<boolean>(false)

  // component.props.headline is basically our "textInput"
  const [component, setComponent] = useState<HeadlineComponent>({
    id: uuidv4().toString(),
    type: 'headline',
    props: {
      headline: '',
    },
  })

  // if returning to component, populate input
  useEffect(() => {
    const foundComponent = onboardingState.profile.components.find(
      (component) => component.type === 'headline'
    )
    if (foundComponent) {
      setValid(true)
      setShowButton(true)
      // @ts-ignore
      const headline = foundComponent.props.headline
      if (headline !== '') {
        setComponent({
          ...component,
          props: { ...component.props, headline: headline },
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // dispatch the updated text to OnboardingContext state
  const onBlur = () => {
    onboardingDispatch(updateComponent(component))
  }

  // updates textinput (text that is displayed) and component
  const onChange = (event: any) => {
    setStarted(true)

    const filteredText: string = event.target.value
    setComponent({
      ...component,
      props: { ...component.props, headline: filteredText },
    })

    if (filteredText !== '') {
      setValid(true)
      setShowButton(true)
    } else {
      setValid(false)
      setShowButton(false)
    }
  }

  // enter key advances form
  const onKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      onboardingDispatch(updateComponent(component))
      onForwardClick()
    }
  }

  return (
    <OnboardingScreenContainer column width={12}>
      <OnboardingTitleText>{title}</OnboardingTitleText>
      <OnboardingTextArea
        autoFocus
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        value={component.props.headline}
      />
      {started && !valid && <H2>Please enter your one-liner</H2>}
    </OnboardingScreenContainer>
  )
}

// HEADSHOT //
type OnboardingHeadshotProps = {
  id: number
  title: string
  placeholder: string
  setShowButton: any
}
export const OnboardingHeadshot: React.FC<OnboardingHeadshotProps> = ({
  id,
  title,
  placeholder,
  setShowButton,
}) => {
  let mobile = useMobile()
  const { onboardingState, onboardingDispatch } = useOnboardingContext()

  // local state to render spinner while uploading image
  const [uploading, setUploading] = useState<boolean>(false)

  const [component, setComponent] = useState<HeadshotComponent>({
    id: uuidv4().toString(),
    type: 'headshot',
    props: {
      image: placeholder,
    },
  })

  // if returning to component, populate input
  useEffect(() => {
    const foundComponent = onboardingState.profile.components.find(
      (component) => component.type === 'headshot'
    )
    if (foundComponent) {
      setShowButton(true)
      // @ts-ignore
      const image = foundComponent.props.image
      if (image !== '') {
        setComponent({
          ...component,
          props: { ...component.props, image: image },
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleFileUpload = async (event: any) => {
    setUploading(true)

    const imageFile = event.target.files[0]
    const compressedFile = await imageCompression(imageFile, {
      maxSizeMB: 0.3,
      maxWidthOrHeight: 720,
    })

    const formData = new FormData()
    formData.append('file', compressedFile)

    const res = await PostProtectProfileImage(formData)
    const uploadedImage = res.data.image

    // maintain local component for display
    setComponent({
      ...component,
      props: {
        image: uploadedImage,
      },
    })

    // update glocal component
    onboardingDispatch(
      updateComponent({
        ...component,
        props: {
          image: uploadedImage,
        },
      })
    )

    setUploading(false)
    setShowButton(true)
  }

  // need to add spinner here based on {uploading}
  return (
    <OnboardingScreenContainer column width={12}>
      <OnboardingTitleText>{title}</OnboardingTitleText>

      <OnboardingHeadshotUpload
        size={mobile ? 12 : 6}
        src={'large/' + component.props?.image}
      >
        <ProfileImageUploadTopWrapper>
          {uploading && (
            <ClipLoader
              css={'position: relative; left: -50%; text-align: center;'}
              loading={uploading}
              color={'#000000'}
            />
          )}
          {!uploading && (
            <ProfileImageUploadWrapper>
              Choose Photo
              <ProfileImageUploadInput
                type="file"
                onChange={handleFileUpload}
              />
            </ProfileImageUploadWrapper>
          )}
        </ProfileImageUploadTopWrapper>
      </OnboardingHeadshotUpload>
    </OnboardingScreenContainer>
  )
}

// DONE //
export const OnboardingDone: React.FC = () => {
  let history = useHistory()
  const { dispatch } = useAppContext()

  const { onboardingState } = useOnboardingContext()

  const onClick = async () => {
    dispatch(setUsername(onboardingState.profile.username))

    // here we will rearrange the profile object and add empty components.
    const components = [...onboardingState.profile.components]

    // get indices of headshot and headline
    const indexHeadshot = components
      .map((comp) => comp.type)
      .indexOf('headshot')
    const indexHeadline = components
      .map((comp) => comp.type)
      .indexOf('headline')

    // swap them
    const tmp = components[indexHeadline]
    components[indexHeadline] = components[indexHeadshot]
    components[indexHeadshot] = tmp

    await Promise.all([
      PostProtectUsername(onboardingState.profile.username),
      PostProtectComponents(components),
    ])

    dispatch(setOnboarded(true))
    history.push(`/${onboardingState.profile.username}`)

    // PostProtectProfile(profile)
    // 	.then(res => {
    // 		dispatch(setOnboarded(true))
    // 		history.push(`/${onboardingState.profile.username}`)
    // 	})
    // 	.catch(err => {
    // 		console.log('PostProtectProfile error:', err)
    // 	})
  }

  return (
    <OnboardingScreenContainer column width={12}>
      <OnboardingTitleText>
        Welcome to Corner. <br /> We're Glad You're Here.
      </OnboardingTitleText>
      <ButtonWrapper row width={12}>
        <DoneButton onClick={onClick}>Go to your profile</DoneButton>
      </ButtonWrapper>
    </OnboardingScreenContainer>
  )
}

const OnboardingScreenContainer = styled(Div)`
  justify-content: center;
`

const ButtonWrapper = styled(Div)`
  margin-top: 60px;
  display: flex;
  position: relative;
  justify-content: space-between;
  max-width: 350px;
  @media (max-width: 768px) {
    margin: 0;
  }
`

const OnboardingTitleText = styled(H1)`
  font-family: 'glypha';
  font-size: 30px;
`

const OnboardingTextArea = styled(TextArea)`
  font-family: 'glypha';
  font-size: 30px;
  margin-top: 10px;
  ::-webkit-input-placeholder {
    /* Chrome */
    color: lightgray;
  }
  :-ms-input-placeholder {
    /* IE 10+ */
    color: lightgray;
  }
  ::-moz-placeholder {
    /* Firefox 19+ */
    color: lightgray;
    opacity: 1;
  }
  :-moz-placeholder {
    /* Firefox 4 - 18 */
    color: lightgray;
    opacity: 1;
  }
  color: black;
`

const OnboardingHeadshotUpload = styled(Img)`
  margin-top: 20px;
  justify-content: center;
  align-items: center;
`

const DoneButton = styled(Button)`
  position: relative;
  @media (max-width: 768px) {
    position: absolute;
    bottom: 10px;
    right: 0px;
  }
`

const ProfileImageUploadInput = styled.input`
  display: none;
  width: unset;
`

const ProfileImageUploadTopWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(0%, -50%);
`

const ProfileImageUploadWrapper = styled.label`
  position: relative;
  left: -50%;
  text-align: center;
  width: unset;

  border: none;
  padding: 0;
  margin: 0;
  text-decoration: none;

  font-family: 'inter';
  font-size: 16px;

  background-color: black;
  color: white;
  padding: 10px 20px 12px 20px;
  cursor: pointer;
  border-radius: 30px;
`

// GenerateOnboardingComponent takes object {id, component, props},
// then generates a component from the Components map above
// also, the id and key are injected as props to each component
type ComponentIndex = {
  [index: string]: any
}
const Components: ComponentIndex = {
  username: OnboardingUsername,
  name: OnboardingName,
  headline: OnboardingHeadline,
  headshot: OnboardingHeadshot,
  done: OnboardingDone,
}
export const GenerateOnboardingComponent = (
  component: any,
  onForwardClick: any,
  setShowButton: any
) => {
  // component exists
  if (typeof Components[component.type] !== 'undefined') {
    return React.createElement(Components[component.type], {
      ...component?.props,
      id: component.id,
      key: component.id,
      onForwardClick: onForwardClick,
      setShowButton: setShowButton,
    })
  }
  // component does not exist
  return <React.Fragment key={component.id} />
}
