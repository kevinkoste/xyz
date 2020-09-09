import React, { useEffect } from 'react'
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid'

// presentation
import { useDetectMobile } from '../libs/hooksLib'
import { Div, Button } from '../components/Base'
import { Header } from '../components/Header'

// logic
import { useAppContext } from '../context/AppContext'
import { Profile } from '../models/Profile'
import { useProfileContext, updateProfile, setEditing } from '../context/ProfileContext'
import { GenerateEditComponent } from '../components/ProfileEdit'
import { GetPublicProfileData, PostProtectProfile } from '../libs/apiLib'


export const EditProfilePage: React.FC = () => {

  const mobile: boolean = useDetectMobile()

  // not yet sure which we are using...
  const { state } = useAppContext()
  const { profileState, profileDispatch } = useProfileContext()

  // on mount, supply profileState with public profile data and add missing components if needed
  useEffect(() => {

    const onMount = async () => {
      const response = await GetPublicProfileData(state.username)
      const profile: Profile = response.data

      // add any missing components
      for (let type of ['bio', 'bookshelf', 'experiences', 'integrations']) {
        if (profile.components.find(comp => comp.type === type) === undefined) {
          if (type === 'bio') {
            profile.components.push({
              id: uuidv4().toString(),
              type: type,
              props: { bio: '' }
            })
          } else if (type === 'bookshelf') {
            profile.components.push({
              id: uuidv4().toString(),
              type: 'bookshelf',
              props: { books: [] }
            })
          } else if (type === 'experiences') {
            profile.components.push({
              id: uuidv4().toString(),
              type: 'experiences',
              props: { experiences: [] }
            })
          }
          else if (type === 'integrations') {
            profile.components.push({
              id: uuidv4().toString(),
              type: 'integrations',
              props: { integrations: [] }
            })
          }
        }
      }

      // dispatch to profile context
      profileDispatch(updateProfile(profile))
    }

    onMount()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  // on save profile, post new profile data to server
  const onSave = async () => {
    if (profileState.editing) {
      await PostProtectProfile(profileState.profile)
    }
    profileDispatch(setEditing(!profileState.editing))
  }

	return (
		<PageContainer column width={12}>

      <Header title={profileState.profile.components.find(comp => comp.type === 'name')?.props.name} />

      <BodyContainer column width={mobile ? 11 : 8}>

        <CenteredContainer column width={12}>
          <FrontPageWrapper>
            { profileState.profile.components
              .filter(comp => comp.type === 'headshot' )
              .map(comp => GenerateEditComponent(comp))
            }
          </FrontPageWrapper>
          <FrontPageWrapper>
            { profileState.profile.components
              .filter(comp => comp.type === 'headline' )
              .map(comp => GenerateEditComponent(comp))
            }
            { !mobile && profileState.profile.components
              .filter(comp => comp.type === 'bio' )
              .map(comp => GenerateEditComponent(comp))
            }
            { !mobile && profileState.profile.components
              .filter(comp => comp.type === 'experiences' )
              .map(comp => GenerateEditComponent(comp))
            }
          </FrontPageWrapper>
        </CenteredContainer>
        <Div column width={12}>
          { mobile && profileState.profile.components
            .filter(comp => comp.type !== 'headshot' && comp.type !== 'headline' )
            .map(comp => GenerateEditComponent(comp))
          }
          { !mobile && profileState.profile.components
            .filter(comp => comp.type !== 'headshot' && comp.type !== 'headline' && comp.type !== 'bio' && comp.type !== 'experiences' )
            .map(comp => GenerateEditComponent(comp))
          }
        </Div>

      </BodyContainer>

      <ButtonContainer row width={12}>
        <EditButton onClick={onSave} >
          {profileState.editing ? 'Finish Editing' : 'Edit Corner'}
        </EditButton>
      </ButtonContainer>

      { mobile &&
        <Div style={{height:'60px'}}/>
      }

		</PageContainer>
	)
}
export default EditProfilePage


const PageContainer = styled(Div)`
  max-width: 100vw;
	align-items: center;
  position: relative;
  min-height: ${window.innerHeight+"px"};
`

const BodyContainer = styled(Div)`
  padding-top: 51px;
  max-width: 1150px;
`

const CenteredContainer = styled(Div)`
  justify-content: center;
  flex-direction: row;
  min-height: ${(window.innerHeight - 51)+"px"};
  @media (max-width: 768px) {
    flex-direction: column;
	}
`

const FrontPageWrapper = styled(Div)`
	width: 50%;
	flex-direction: column;
	justify-content: center;
	display: flex;
	@media (max-width: 768px) {
		width: unset;
	}
`

const EditButton = styled(Button)`
  position: fixed;
  bottom: 10px;
  right: 8.34vw;
  @media (max-width: 768px) {
		right: 4.17vw;
	}
  @media (min-width: 1560px) {
    right: ${parseInt(((window.innerWidth-1300)*0.5).toString(),10) + "px"}
  }
`

const ButtonContainer = styled(Div)`
	display: flex;
	position: relative;
	justify-content: space-between;
	max-width: 350px;
	@media (max-width: 768px) {
		margin: 0;
	}
`
