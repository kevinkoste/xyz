import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid'
import ExitIcon from '../icons/delete.svg'

// presentation/types
import {
  Div,
  H1,
  H2,
  ExternalImg,
  InlineInput,
  ComponentContainer,
} from '../components/Base'
import { Book, BookshelfComponent } from '../models/Profile'
import { ComponentMenu } from '../components2/ComponentMenu'

// logic
import { GetBookData } from '../libs/books'
import {
  useProfileContext,
  updateComponent,
  deleteBookById,
} from '../context/ProfileContext'

export const EditBookshelf: React.FC<BookshelfComponent> = ({ id, props }) => {
  const { profileState } = useProfileContext()

  if (profileState.editing) {
    return (
      <ComponentContainer>
        <ComponentMenu>
          <H1
            style={{
              color:
                profileState.profile.components.find(
                  (comp) => comp.type === 'bookshelf'
                )?.props.books.length === 0
                  ? 'lightgray'
                  : '',
            }}
          >
            Bookshelf
          </H1>

          <BookAddRow id={id} />

          {profileState.profile.components
            .find((comp) => comp.type === 'bookshelf')
            ?.props.books.map((book: any, idx: number) => (
              <BookEditRow key={idx} book={book} />
            ))}
        </ComponentMenu>
      </ComponentContainer>
    )
  } else {
    return (
      <ComponentContainer>
        <H1>Bookshelf</H1>

        {profileState.profile.components
          .find((comp) => comp.type === 'bookshelf')
          ?.props.books.map((book: any, idx: number) => (
            <BookRow withLink={true} key={idx} book={book} />
          ))}
      </ComponentContainer>
    )
  }
}

// pure presentation component for Book
type BookRowProps = { book: any; color?: string; withLink?: boolean }
const BookRow: React.FC<BookRowProps> = ({ book, color, withLink }) => {
  const { title, author, date, link, image } = book

  if (withLink) {
    return (
      <a
        href={withLink ? link : void 0}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: 'none' }}
      >
        <Div
          row
          width={12}
          style={{ alignItems: 'top', marginTop: '15px', marginBottom: '15px' }}
        >
          <LogoWrapper style={{ position: 'relative' }}>
            <ExternalImg
              src={image}
              style={{
                minWidth: '51px',
                minHeight: '60px',
                backgroundSize: 'contain',
              }}
            />
          </LogoWrapper>

          <ExperienceText
            column
            width={12}
            style={{ color: color || 'black', overflow: 'hidden' }}
          >
            <BookText>{title}</BookText>
            <BookText>{author}</BookText>
            <BookText>{date}</BookText>
          </ExperienceText>
        </Div>
      </a>
    )
  } else {
    return (
      <Div
        row
        width={12}
        style={{ alignItems: 'top', marginTop: '15px', marginBottom: '15px' }}
      >
        <LogoWrapper style={{ position: 'relative' }}>
          <ExternalImg
            src={image}
            style={{
              minWidth: '51px',
              minHeight: '60px',
              backgroundSize: 'contain',
            }}
          />
        </LogoWrapper>

        <ExperienceText
          column
          width={12}
          style={{ color: color || 'black', overflow: 'hidden' }}
        >
          <BookText>{title}</BookText>
          <BookText>{author}</BookText>
          <BookText>{date}</BookText>
        </ExperienceText>
      </Div>
    )
  }
}

// similar to presentation but with delete button
const BookEditRow: React.FC<BookRowProps> = ({ book, color }) => {
  const { profileDispatch } = useProfileContext()
  const { id, title, author, date, image } = book

  const handleDeleteBook = () => {
    profileDispatch(deleteBookById(id))
  }

  return (
    <Div
      row
      width={12}
      style={{ alignItems: 'top', marginTop: '15px', marginBottom: '15px' }}
    >
      <LogoWrapper style={{ position: 'relative' }}>
        <ExternalImg
          src={image}
          style={{
            minWidth: '51px',
            minHeight: '60px',
            backgroundSize: 'contain',
          }}
        />
        <DeleteIcon src={ExitIcon} onClick={handleDeleteBook} />
      </LogoWrapper>

      <ExperienceText
        column
        width={12}
        style={{ color: color || 'black', overflow: 'hidden' }}
      >
        <BookText>{title}</BookText>
        <BookText>{author}</BookText>
        <BookText>{date}</BookText>
      </ExperienceText>
    </Div>
  )
}

// book add form, needs the id to update the component in onClick
type BookAddRowProps = { id: string }
const BookAddRow: React.FC<BookAddRowProps> = ({ id }) => {
  const { profileState, profileDispatch } = useProfileContext()

  const [bookInput, setBookInput] = useState<string>('')
  const [bookData, setBookData] = useState<Book>({
    id: '',
    title: '',
    author: '',
    date: '',
    link: '',
    image: '',
  })

  // checks availability on a timeout
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (bookInput !== '') {
        GetBookData(bookInput)
          .then((res) => {
            const book = res.data.items[0]

            const imageUrlRaw = book.volumeInfo.imageLinks.thumbnail
            const imageUrl =
              imageUrlRaw.slice(0, 4) + 's' + imageUrlRaw.slice(4)

            setBookData({
              id: uuidv4().toString(),
              title: book.volumeInfo.title,
              author: book.volumeInfo.authors[0],
              date: book.volumeInfo.publishedDate.substring(0, 4),
              link: book.volumeInfo.infoLink,
              image: imageUrl,
            })
          })
          .catch((err) => console.log(err))
      }
    }, 200)
    return () => clearTimeout(delayDebounceFn)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookInput])

  const onClick = () => {
    if (bookInput !== '') {
      setBookInput('')
      setBookData({
        id: '',
        title: '',
        author: '',
        date: '',
        link: '',
        image: '',
      })
      profileDispatch(
        updateComponent({
          id: id,
          type: 'bookshelf',
          props: {
            books: [
              bookData,
              ...profileState.profile.components.find(
                (comp) => comp.type === 'bookshelf'
              )?.props.books,
            ],
          },
        })
      )
    }
  }

  return (
    <Div row width={12} style={{ alignItems: 'top', marginTop: '15px' }}>
      <Div column width={12}>
        <H2>Enter the title of a book</H2>
        <BookInput
          placeholder={'e.g. Great Expectations'}
          onChange={(event: any) => setBookInput(event.target.value)}
          value={bookInput}
        />

        {/* this is the preview row */}
        {bookInput !== '' && (
          <Div onClick={onClick}>
            <BookRow withLink={false} book={bookData} />
          </Div>
        )}
      </Div>
    </Div>
  )
}

// building the public version here:
export const Bookshelf: React.FC<BookshelfComponent> = ({ id, props }) => {
  if (props.books.length !== 0) {
    return (
      <ComponentContainer>
        <H1>Bookshelf</H1>
        {props.books.map((book: any, idx: number) => (
          <BookRow withLink={true} key={idx} book={book} />
        ))}
      </ComponentContainer>
    )
  } else {
    return <React.Fragment />
  }
}

const BookInput = styled(InlineInput)`
  border-bottom: 1px solid darkgrey;
  height: 26px;
`

const ExperienceText = styled(Div)`
  display: inline-block;
  margin-left: 15px;
`

const BookText = styled(H2)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const LogoWrapper = styled(Div)`
  margin-left: 15px;
  @media (max-width: 768px) {
    margin-left: 0px;
  }
`

const DeleteIcon = styled.img`
  position: absolute;
  background-size: 50%;
  left: -10px;
  right: 0;
  z-index: 2;
  height: 72px;
  width: 72px;
`
