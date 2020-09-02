import React, { useState, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import styled from 'styled-components'

// presentation
import { useDetectMobile } from '../libs/hooksLib'
import { Div, H1 } from '../components/BaseComponents'
import { Header } from '../components/Header'

// logic
import { useAppContext } from '../context/AppContext'
import { Profile, EmptyProfile } from '../models/Profile'
import { GetPublicProfileData } from '../libs/apiLib'
import { GenerateComponent } from '../components/ProfileComponents'


export const ProfilePage: React.FC = () => {

  let history = useHistory()
  const mobile: boolean = useDetectMobile()
  const { state, dispatch } = useAppContext()

  const { username } = useParams()
  const [ loading, setLoading ] = useState<boolean>(true)
  const [ profileExists, setProfileExists ] = useState<boolean>(false)
  const [ profile, setProfile ] = useState<Profile>(EmptyProfile)

  // on component mount, get profile data from server
  useEffect(() => {

    if (state.username === username) {
      history.push(`/edit/${state.username}`)
    } else {
      GetPublicProfileData(username)
      .then(res => {
        if (res.data === false) {
          setProfileExists(false)
          setLoading(false)
        } else {
          console.log('got public profile with res:', res)
          setProfile(res.data)
          setProfileExists(true)
          setLoading(false)
        }
      })
      .catch(err => console.log(err))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!loading && profileExists) {
    return (
      <PageContainer column width={12}>
  
        <Header title={profile.components.find(component => component.type === 'name')?.props.name} />
  
        <BodyContainer column width={mobile ? 11 : 6}>

          <CenteredContainer column width={12}>
            { profile.components
              .filter(comp => comp.type === 'headshot' || comp.type === 'headline' )
              .map(comp => GenerateComponent(comp, profile))
            }
          </CenteredContainer>

          { profile.components
            .filter(comp => comp.type !== 'headshot' && comp.type !== 'headline' )
            .map(comp => GenerateComponent(comp, profile))
          }


        </BodyContainer>
  
      </PageContainer>
    )
  } else if (!loading && !profileExists) {
    return (
      <PageContainer column width={12}>

        <Header title={'Profile Not Found'} />

        <NotFoundContainer column width={mobile ? 11 : 6}>
          <H1>
            This profile doesn't exist!
          </H1>
        </NotFoundContainer>

      </PageContainer>
    )
  } else {
    return (
      <div style={{height: '100vh', backgroundColor: 'white'}}/>
    )
  }

}

const PageContainer = styled(Div)`
  max-width: 100vw;
	height: ${window.innerHeight+"px"};
	align-items: center;
	position: relative;
`

const BodyContainer = styled(Div)`
  padding-top: 51px;
`

const CenteredContainer = styled(Div)`
  justify-content: center;
  min-height: ${(window.innerHeight - 51)+"px"};
`

const NotFoundContainer = styled(Div)`
  flex: 1;
  justify-content: center;
`

