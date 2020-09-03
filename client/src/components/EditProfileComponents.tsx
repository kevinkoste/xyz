import React, { useState } from 'react'
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid'
import ClipLoader from "react-spinners/ClipLoader"

// presentation/types
import { useDetectMobile } from '../libs/hooksLib'
import { Div, H1, H2, Img, ExternalImg, TextArea, Button, Input } from '../components/BaseComponents'
import { Component,	HeadlineComponent,	BioComponent,	HeadshotComponent, ExperiencesComponent,ArticleComponent } from '../models/Profile'

// logic
import { useProfileContext, setEditing, updateComponent, updateExperience } from '../context/ProfileContext'
import { PostProtectProfileImage, GetPublicCompanyFromDomain } from '../libs/apiLib'


export const Headshot: React.FC<HeadshotComponent> = ({ id, props }) => {

	const mobile: boolean = useDetectMobile()

  const { profileState, profileDispatch } = useProfileContext()

	const [ uploading, setUploading ] = useState(false)

	const handleFileUpload = (event: any) => {
		setUploading(true)
		const formData = new FormData()
		formData.append('file', event.target.files[0])
		PostProtectProfileImage(profileState.profile.username, formData)
			.then(res => {
				profileDispatch(updateComponent({
					id: id,
					type: 'headshot',
					props: {
						image: res.data.image
					}
				}))
				setUploading(false)
			}).catch(err => {
				setUploading(false)
			})
	}
	
	return (
		<ProfileImage size={mobile? 12 : 10} src={props.image}>

			{ (profileState.editing) &&
				<ProfileImageUploadTopWrapper>
						{	uploading &&
							<ClipLoader
								css={'position: relative; left: -50%; text-align: center;'}
								loading={uploading}
								color={'#000000'}
							/>
						}
						{ !uploading &&
							<ProfileImageUploadWrapper>
								Choose Photo
								<ProfileImageUploadInput
									type='file'
									onChange={handleFileUpload}
								/>
							</ProfileImageUploadWrapper>
						}
				</ProfileImageUploadTopWrapper>
			}

		</ProfileImage>
	)
}


export const Headline: React.FC<HeadlineComponent> = ({ id, props }) => {

	const { profileState, profileDispatch } = useProfileContext()

	const [ textInput, setTextInput ] = useState<string>(props.headline)

	const placeholder = 'John Kauber is a Security Engineer and Analyst passionate about protecting critical systems from threat of attack.'

	const handleClickAway = () => {
		profileDispatch(updateComponent({
			id: id,
			type: 'headline',
			props: {
				headline: textInput
			}
		}))
	}

	const onAddClick = () => {
		profileDispatch(setEditing(true))
	}


	if (!profileState.editing && textInput === "") {
		// not editing, component is not populated
		return (
			<Div column width={12} style={{marginTop: '20px', position: 'relative'}}>

				<H1 style={{color: 'lightgray'}}>
					{placeholder}
				</H1>

				<AddButton onClick={onAddClick}>
					Add a headline
				</AddButton>

			</Div>
		)
	} else if (profileState.editing) {
		return (
			<HeadlineTextArea
				placeholder={placeholder}
				onBlur={handleClickAway}
				onChange={(event: any) => setTextInput(event.target.value)}
				value={textInput}
			/>
		)
	} else {
		return (
			<HeadlineText>
				{textInput}
			</HeadlineText>
		)
	}
}

export const Bio: React.FC<BioComponent> = ({ id, props }) => {

  const { profileState, profileDispatch } = useProfileContext()

	const [ textInput, setTextInput ] = useState<string>(props.bio)

	const placeholder = "He’s currently a security engineer at BigCo, where he’s helping to build a system wide penetration testing platform to keep BigCo’s systems safe. A big advocate for the EFF, part-time white hat hacker, and proud member of the Information Systems Security Association, John also founded the young hacker coalition (YHC) in 2018. John loves to travel internationally, and is rarely found abroad without a camera in his hand. You can find him in San Francisco, California."

	const handleClickAway = () => {
		profileDispatch(updateComponent({
			id: id,
			type: 'bio',
			props: {
				bio: textInput
			}
		}))
	}

	const onAddClick = () => {
		profileDispatch(setEditing(true))
	}


	if (!profileState.editing && textInput === "") {
		return (
			<ComponentContainer column>

				<H1 style={{color: 'lightgray'}}>
					About {profileState.profile.components.find(comp => comp.type === 'name')?.props.name.split(' ')[0]}
				</H1>

				<Div column width={12} style={{position: 'relative'}}>
					<H2 style={{color: 'lightgray', lineHeight: '24px'}}>
						{placeholder}
					</H2>

					<AddButton onClick={onAddClick}>
						Add a bio
					</AddButton>
				</Div>

			</ComponentContainer>
		)
	} else if (profileState.editing) {
		return (
			<ComponentContainer column>
				<H1 style={{color: (textInput === "" ? 'lightgray': 'black')}}>
					About {profileState.profile.components.find(comp => comp.type === 'name')?.props.name.split(' ')[0]}
				</H1>
				<BioTextArea
					placeholder={placeholder}
					onBlur={handleClickAway}
					onChange={(event: any) => setTextInput(event.target.value)}
					value={textInput}
				/>
			</ComponentContainer>
		)
	} else {
		return (
			<ComponentContainer column>
				<H1>
					About {profileState.profile.components.find(comp => comp.type === 'name')?.props.name.split(' ')[0]}
				</H1>
				<BioText>
					{textInput}
				</BioText>
			</ComponentContainer>
		)
	}
}


export const Experiences: React.FC<ExperiencesComponent> = ({ id, props }) => {

  const { profileState, profileDispatch } = useProfileContext()

	// const [ experiences, setExperiences ] = useState(props.experiences)

	const placeholder = [
		{
			id: '1',
			domain: 'google.com',
			title: 'Security Engineer',
			company: 'Google',
			date: 'June 2020 - present'
		},
		{
			id: '2',
			domain: 'retool.com',
			title: 'Sofware Engineer',
			company: 'Retool',
			date: 'Jan 2019 - June 2020'
		},
		{
			id: '3',
			domain: 'stripe.com',
			title: 'Software Engineering Intern',
			company: 'Stripe',
			date: '2018'
		}
	]

	const onAddClick = () => {
		profileDispatch(setEditing(true))
	}

	// controlling domain input for add experience option
	const [ domainInput, setDomainInput ] = useState<string>('')

	const onDomainClick = async () => {
		let company: string
		try {
			const response = await GetPublicCompanyFromDomain(domainInput)
			company = response.data
		} catch {
			company = ''
		}

		const experience = {
			id: uuidv4().toString(),
			domain: domainInput,
			title: '',
			company: company,
			date: ''
		}

		profileDispatch(updateComponent({
			id: id,
			type: 'experiences',
			props: { experiences: [...profileState.profile.components.find(comp => comp.type === 'experiences')?.props.experiences, experience] }
		}))
	}

	if (!profileState.editing && profileState.profile.components.find(comp => comp.type === 'experiences')?.props.experiences.length === 0) {
		return (
			<Div column width={12} style={{marginTop: '60px'}}>

				<H1 style={{color: 'lightgray'}}>
					Experiences
				</H1>

				<Div column width={12} style={{position: 'relative'}}>
					{ placeholder.map((exp, idx) => 
						<ExperienceRow
							color={'lightgray'}
							key={idx}
							experience={exp}
						/>
					)}
					<AddButton onClick={onAddClick}>
						Add experiences
					</AddButton>
				</Div>

			</Div>
		)
	} else if (profileState.editing) {
		return (
			<Div column width={12} style={{marginTop: '60px'}}>
				<H1>
					Experiences
				</H1>

				{/* this needs to be the experiences edit row */}
				{ profileState.profile.components.find(comp => comp.type === 'experiences')?.props.experiences.map((exp: any, idx: number) => 
					<ExperienceEditRow
						key={idx}
						experience={exp}
					/>
				)}

				{/* this is the domain input form */}
				<Div row width={12} style={{ alignItems:'top', marginTop:'15px' }}>
			
					<Div column width={12} style={{ marginLeft:'10px' }}>
						<H2>
							Enter your company domain name
						</H2>
						<Div width={12} style={{ position:'relative' }}>
							<ExperienceInput
								placeholder={'google.com'}
								onChange={(event: any) => setDomainInput(event.target.value)}
								value={domainInput}
							/>
							<DomainButton onClick={onDomainClick}>
								Invite &#62;
							</DomainButton>
						</Div>
					</Div>

				</Div>

			</Div>
		)
	} else {
		return (
			<Div column width={12} style={{marginTop: '60px'}}>
				<H1>
					Experiences
				</H1>

				{ profileState.profile.components.find(comp => comp.type === 'experiences')?.props.experiences.map((exp: any, idx: number) => 
					<ExperienceRow
						key={idx}
						experience={exp}
					/>
				)}

			</Div>
		)
	}
}


type ExperienceRowProps = { experience: any, color?: string }
const ExperienceRow: React.FC<ExperienceRowProps> = ({ experience, color }) => {

	const { domain, title, company, date } = experience

	return (
		<Div row width={12} style={{ alignItems:'top', marginTop:'15px' }}>

			<ExternalImg
				src={`//logo.clearbit.com/${domain}`}
				style={{ minWidth:'51px', minHeight:'51px', backgroundSize:'contain' }}
			/>

			<Div column width={12} style={{ marginLeft:'10px', color: color||'black' }}>
				<H2>
					{title} at {company}
				</H2>
				<H2>
					{date}
				</H2>
			</Div>

		</Div>
	)
}

const ExperienceEditRow: React.FC<ExperienceRowProps> = ({ experience, color }) => {

	const { id, domain, title, company, date } = experience

	const { profileState, profileDispatch } = useProfileContext()

	const [ titleInput, setTitleInput ] = useState(title)
	const [ companyInput, setCompanyInput ] = useState(company)
	const [ dateInput, setDateInput ] = useState(date)

	const handleClickAway = () => {
		profileDispatch(updateExperience({
			id: id,
			domain: domain,
			title: titleInput,
			company: companyInput,
			date: dateInput
		}))
	}


	return (
		<Div row width={12} style={{ alignItems:'top', marginTop:'15px' }}>

			{/* need to add delete functionality */}
			<ExternalImg
				src={`//logo.clearbit.com/${domain}`}
				style={{ minWidth:'51px', minHeight:'51px', backgroundSize:'contain' }}
			/>

			<Div column width={12} style={{ marginLeft:'10px', color: color||'black' }}>
				<Div row width={12}>
					<ExperienceInput
						placeholder={'Software Engineer'}
						onChange={(event: any) => setTitleInput(event.target.value)}
						value={titleInput}
						onBlur={handleClickAway}
					/>
					at 
					<ExperienceInput
						placeholder={'Google'}
						onChange={(event: any) => setCompanyInput(event.target.value)}
						value={companyInput}
						onBlur={handleClickAway}
					/>
				</Div>
				<ExperienceInput
					placeholder={'August 2019 - Present'}
					onChange={(event: any) => setDateInput(event.target.value)}
					value={dateInput}
					onBlur={handleClickAway}
				/>
			</Div>

		</Div>
	)
}

const ExperienceInput = styled(Input)`
	font-family: 'inter';
  font-size: 16px;
	line-height: 24px;
`

const DomainButton = styled(Button)`
	/* background-color: black; */
	/* color: white; */
	font-size: 16px;
	font-family: 'inter';
  line-height: 24px;
	padding: 0;
	@media (max-width: 768px) {
		position: absolute;
		right: 0;
	}
`




export const Article: React.FC<ArticleComponent> = ({ id, props }) => {

	return (
		<BioText>
			{props.title}
		</BioText>
	)
}



const HeadlineText = styled(H1)`
	margin-top: 20px;
`

const HeadlineTextArea = styled(TextArea)`
	font-size: 36px;
	margin-top: 20px;
	::-webkit-input-placeholder { /* Chrome */
  	color: lightgray;
	}
	:-ms-input-placeholder { /* IE 10+ */
  	color: lightgray;
	}
	::-moz-placeholder { /* Firefox 19+ */
		color: lightgray;
		opacity: 1;
	}
	:-moz-placeholder { /* Firefox 4 - 18 */
		color: lightgray;
		opacity: 1;
	}
	@media (max-width: 768px) {
		font-size: 30px;
	}
`

const ComponentContainer = styled(Div)`
	margin-top: 40px;
	@media (max-width) {
		margin-top: 20px;
		margin-bottom: 80px;
	}
`

const BioText = styled(H2)`
	margin-top: 10px;
	white-space: pre-wrap;
`

const BioTextArea = styled(TextArea)`
	font-family: 'inter';
  font-size: 18px;
	line-height: 24px;
	margin-top: 10px;

	::-webkit-input-placeholder { /* Chrome */
  	color: lightgray;
	}
	:-ms-input-placeholder { /* IE 10+ */
  	color: lightgray;
	}
	::-moz-placeholder { /* Firefox 19+ */
		color: lightgray;
		opacity: 1;
	}
	:-moz-placeholder { /* Firefox 4 - 18 */
		color: lightgray;
		opacity: 1;
	}
	@media (max-width: 768px) {
		font-size: 16px;
	}
`

const ProfileImage = styled(Img)`
	margin-top: 20px;
` 

const ProfileImageUploadInput = styled.input`
	display: none;
	width: unset;
`

const ProfileImageUploadTopWrapper = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
  transform: translate(0,-50%);
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


const AddButton = styled(Button)`
	position: absolute;
	top: 50%;
	left: 50%;
  transform: translate(-50%,-50%);
`


// GenerateComponent takes JSON {id, component, props},
// then generates a component from the Components map above
// also, the id and key are injected as props to each component
type ComponentIndex = {
	[index: string]: any
}
const Components: ComponentIndex  = {
	headline: Headline,
  bio: Bio,
	headshot: Headshot,
	experiences: Experiences,
  article: Article
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