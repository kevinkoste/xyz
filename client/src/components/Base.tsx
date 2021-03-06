import React from 'react'
import styled from 'styled-components'
import TextareaAutosize from 'react-textarea-autosize'
import BeatLoader from 'react-spinners/BeatLoader'

// minimal Div component
type GridMapType = { [index: number]: string }
export const GridMap: GridMapType = {
  1: '8.33%',
  2: '16.66%',
  3: '25%',
  4: '33.33%',
  5: '41.66%',
  6: '50%',
  7: '58.33%',
  8: '66.66%',
  9: '75%',
  10: '83.33%',
  11: '91.66%',
  12: '100%',
}
type DivProps = {
  column?: boolean
  row?: boolean
  width?: number
}
export const Div = styled.div<DivProps>`
  display: flex;
  flex-direction: ${(props) =>
    props.column ? 'column' : props.row ? 'row' : 'unset'};
  width: ${(props) => (props.width ? GridMap[props.width] : 'unset')};
`

// text defaults
export const H1 = styled.h1`
  font-family: 'source-serif';
  font-size: 36px;
  text-align: left;
  font-weight: unset;
  margin: unset;
  padding: 0px;
  @media (max-width: 768px) {
    font-size: 30px;
  }
`
export const H2 = styled.h2`
  font-family: 'inter';
  font-size: 18px;
  line-height: 24px;
  text-align: left;
  font-weight: unset;
  margin: unset;
  padding: 0px;
  @media (max-width: 768px) {
    font-size: 16px;
  }
`

// default image using background-image
type ImageProps = {
  src: string
  size?: number
}
export const Img = styled.div<ImageProps>`
  background-color: unset;
  background-image: ${(props) =>
    `url(${process.env.REACT_APP_S3_BUCKET + props.src})`};
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  image-orientation: from-image;
  position: relative;
  text-align: center;
  max-height: 0px;
  padding-bottom: ${(props) => (props.size ? GridMap[props.size] : 'unset')};
  width: ${(props) => (props.size ? GridMap[props.size] : 'unset')};
`

export const ExternalImg = styled.div<ImageProps>`
  background-image: ${(props) => `url(${props.src})`};
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  image-orientation: from-image;
  position: relative;
  text-align: center;
  background-color: white;
  padding-bottom: ${(props) => (props.size ? GridMap[props.size] : 'unset')};
  width: ${(props) => (props.size ? GridMap[props.size] : 'unset')};
`

// resizeable textarea using external lib
export const TextArea = styled(TextareaAutosize)`
  outline: none;
  box-shadow: none;
  border: none;
  overflow: hidden;
  resize: none;
  padding: 0px;
  text-align: left;
  white-space: pre-wrap;
  font-family: 'source-serif';
  font-size: 30px;
`

export const Input = styled.input`
  outline: none;
  box-shadow: none;
  border: none;
  overflow: hidden;
  resize: none;
  padding: 0px;
  text-align: left;
  white-space: pre-wrap;
  font-family: 'source-serif';
  font-size: 30px;
`

export const InlineInput = styled.input`
  outline: none;
  box-shadow: none;
  border: none;
  overflow: hidden;
  padding: 0px;
  margin: 0px;
  font-family: 'inter';
  font-size: 18px;
  /* line-height: 24px; */
  @media (max-width: 768px) {
    font-size: 16px;
  }
`

export const Button = styled.button`
  /* removing default button styles */
  display: inline-block;
  border: none;
  outline: none;
  padding: 0;
  margin: 0;
  text-decoration: none;

  font-family: 'inter';
  font-size: 18px;

  color: white;
  background-color: black;
  padding: 10px 20px 12px 20px;
  cursor: pointer;
  border-radius: 30px;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`

export const WhiteButton = styled(Button)`
  color: black;
  background-color: white;
  border: 1px solid black;
`

export const Loader: React.FC = () => {
  return (
    <BeatLoader
      css={
        'height: 24px; width: 72px; overflow: auto; margin: auto; position: absolute; top: 0; left: 0; bottom: 0; right: 0;'
      }
      size={20}
      loading={true}
      color={'#000000'}
    />
  )
}

export const PageContainer = styled(Div)`
  max-width: 100vw;
  min-height: ${window.innerHeight + 'px'};
  align-items: center;
  position: relative;
`

export const BodyContainer = styled(Div)`
  padding-top: calc(51px + 30px);
  padding-bottom: 60px;
  max-width: 1150px;
`

export const HoverButton = styled(Button)`
  position: fixed;
  bottom: 20px;
  right: 8.34vw;
  @media (max-width: 768px) {
    right: 4.17vw;
  }
  @media (min-width: 1560px) {
    right: ${parseInt(((window.innerWidth - 1300) * 0.5).toString(), 10) +
    'px'};
  }
`

export const HoverButtonContainer = styled(Div)`
  display: flex;
  position: relative;
  justify-content: space-between;
  max-width: 350px;
  @media (max-width: 768px) {
    margin: 0;
  }
`

export const ComponentContainer = styled(Div)`
  position: relative;
  flex-direction: column;
  padding: 2rem 1rem 1rem 1rem;
`
