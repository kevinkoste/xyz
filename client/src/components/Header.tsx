import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'

import { Div, H1, H2, Button, TextArea } from './Base'
import BurgerIcon from '../icons/burger.svg'
import ExitIcon from '../icons/exit.png'

import { useAppContext, setAuth } from '../context/AppContext'
import { useMobile } from '../libs/hooks'
import { PostProtectInviteNewEmail, PostAuthLogout } from '../libs/api'

type HeaderProps = { title: string }
export const Header: React.FC<HeaderProps> = ({ title }) => {
  let history = useHistory()
  const { state, dispatch } = useAppContext()
  const [showingBurger, setShowingBurger] = useState<boolean>(false)
  const mobile = useMobile()

  const onClick = () => setShowingBurger(!showingBurger)
  const takeHome = () => {
    if (state.auth) {
      history.push('/browse')
    } else {
      history.push('/')
    }
  }

  const handleLogOut = async () => {
    await PostAuthLogout()
    dispatch(setAuth(false))
    onClick()
    history.push('/')
  }

  if (!showingBurger) {
    return (
      <HeaderContainer row width={mobile ? 11 : 10}>
        <AnimatedName onClick={takeHome}>Corner</AnimatedName>

        <AnimatedTitle onClick={takeHome}>{title}</AnimatedTitle>

        <BurgerButton onClick={onClick} src={BurgerIcon} alt="burger button" />
      </HeaderContainer>
    )
  } else {
    return (
      <BurgerMenu>
        <HeaderContainer
          row
          width={mobile ? 11 : 10}
          style={{ borderBottom: '1px solid white', backgroundColor: 'black' }}
        >
          <HeaderTitleText style={{ color: 'white' }}>Corner</HeaderTitleText>
          <ExitButton
            onClick={onClick}
            src={ExitIcon}
            alt="exit burger button"
          />
        </HeaderContainer>

        <BodyContainer column width={mobile ? 11 : 10}>
          <HeaderTitleText
            onClick={() => {
              history.push(`/browse`)
              onClick()
            }}
            style={{ color: 'white', marginTop: '20px' }}
          >
            Browse Profiles
          </HeaderTitleText>

          {!state.onboarded && !state.auth && (
            <HeaderTitleText
              onClick={() => {
                history.push(`/login`)
                onClick()
              }}
              style={{ color: 'white', marginTop: '20px' }}
            >
              Join Corner
            </HeaderTitleText>
          )}

          {!state.onboarded && state.auth && (
            <React.Fragment>
              <HeaderTitleText
                style={{ color: 'white', marginTop: '20px' }}
                onClick={() => {
                  history.push(`/onboarding`)
                  onClick()
                }}
              >
                Make Your Profile
              </HeaderTitleText>
              <HeaderTitleText
                style={{ color: 'white', marginTop: '20px' }}
                onClick={handleLogOut}
              >
                Log Out
              </HeaderTitleText>
            </React.Fragment>
          )}

          {state.onboarded && state.auth && (
            <React.Fragment>
              <HeaderTitleText
                onClick={() => {
                  history.push(`/edit/${state.username}`)
                  onClick()
                }}
                style={{ color: 'white', marginTop: '20px' }}
              >
                My Profile
              </HeaderTitleText>

              <HeaderTitleText
                onClick={handleLogOut}
                style={{ color: 'white', marginTop: '20px' }}
              >
                Log Out
              </HeaderTitleText>

              <InviteForm />
            </React.Fragment>
          )}
        </BodyContainer>
      </BurgerMenu>
    )
  }
}

const HeaderContainer = styled(Div)`
  position: fixed;
  align-items: center;
  background-color: white;
  z-index: 10;

  padding-top: 15px;
  padding-bottom: 5px;
  border-bottom: 1px solid black;
  max-width: 1300px;
`

const HeaderTitleText = styled(H1)`
  overflow: hidden;
  white-space: nowrap;
  margin: unset;
  font-size: 24px;
  :hover {
    cursor: pointer;
  }
`

const AnimatedNameKeyframes = keyframes`
	0% { width: 0%; height: 0%; }
	0.01% { width: 0%; height: 100%; }
	50% { 
		width: 50%; 
		height: 100%; 
	}
	99.99% { width: 0%; height: 100%; }
	100% { width: 0%; height: 0%; }
`

const AnimatedNameKeyframesMobile = keyframes`
	0% { width: 0%; height: 0%; }
	0.01% { width: 0%; height: 100%; }
	50% { 
		width: 85%; 
		height: 100%; 
	}
	99.99% { width: 0%; height: 100%; }
	100% { width: 0%; height: 0%; }
`

const AnimatedName = styled(HeaderTitleText)`
  animation-name: ${AnimatedNameKeyframes};
  animation-duration: 3s;
  animation-delay: 0.5s;
  animation-timing-function: steps(30, end);
  animation-fill-mode: both;
  @media (max-width: 768px) {
    animation-name: ${AnimatedNameKeyframesMobile};
  }
  :hover {
    cursor: pointer;
  }
`

const AnimatedTitleKeyframes = keyframes`
	0% { width: 0%; height: 0%; }
	0.01% { width: 0%; height: 100%; }
	100% { 
		width: 50%; 
		height: 100%;
	}
`

const AnimatedTitleKeyframesMobile = keyframes`
	0% { width: 0%; height: 0%; }
	0.01% { width: 0%; height: 100%; }
	100% { 
		width: 80%; 
		height: 100%;
	}
`

const AnimatedTitle = styled(HeaderTitleText)`
  animation-name: ${AnimatedTitleKeyframes};
  animation-duration: 1.5s;
  animation-delay: 3.5s;
  animation-timing-function: steps(30, end);
  animation-fill-mode: both;
  @media (max-width: 768px) {
    animation-name: ${AnimatedTitleKeyframesMobile};
  }
  :hover {
    cursor: pointer;
  }
`

const BurgerButton = styled.img`
  position: absolute;
  z-index: 2;
  right: 0;
  height: 30px;
  width: 30px;
  :hover {
    cursor: pointer;
  }
`

const ExitButton = styled.img`
  position: absolute;
  z-index: 2;
  right: 0;
  height: 25px;
  width: 25px;
  :hover {
    cursor: pointer;
  }
`

const BurgerMenu = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;

  background-color: black;
`

const BodyContainer = styled(Div)`
  padding-top: 51px;
  max-width: 1300px;
`

const InviteForm: React.FC = () => {
  const [sent, setSent] = useState<boolean>(false)
  const [emailInput, setEmailInput] = useState<string>('')

  const onSubmit = () => {
    setSent(true)

    PostProtectInviteNewEmail(emailInput)
      .then((res) => {
        console.log(res)
      })
      .catch((err) => console.log(err))
  }

  return (
    <Div column width={12}>
      <HeaderTitleText style={{ color: 'white', marginTop: '60px' }}>
        Invite a friend
      </HeaderTitleText>

      {!sent && (
        <Div row width={12} style={{ position: 'relative', maxWidth: '400px' }}>
          <InviteTextInput
            placeholder={'yourfriend@gmail.com'}
            onChange={(event: any) => setEmailInput(event.target.value)}
            value={emailInput}
            autoCapitalize="none"
          />
          <InviteButton onClick={onSubmit}>Invite &#62;</InviteButton>
        </Div>
      )}

      {sent && (
        <Div row width={12} style={{ position: 'relative', maxWidth: '400px' }}>
          <InvitedText>{emailInput} has been invited!</InvitedText>
        </Div>
      )}
    </Div>
  )
}

const InviteTextInput = styled(TextArea)`
  background-color: black;
  color: white;
  font-size: 18px;
  font-family: 'inter';
  line-height: 24px;
  text-transform: lowercase;
  @media (max-width: 768px) {
    font-size: 16px;
  }
`

const InvitedText = styled(H2)`
  color: white;
  text-align: center;
`

const InviteButton = styled(Button)`
  background-color: black;
  color: white;
  font-size: 18px;
  font-family: 'inter';
  line-height: 24px;
  padding: 0;
  @media (max-width: 768px) {
    position: absolute;
    right: 0;
    font-size: 16px;
  }
  :hover {
    cursor: pointer;
  }
`
