import { CircularProgress, useToast } from '@chakra-ui/react'
import axios from 'axios'
import Cookies from 'js-cookie'

import React, { useReducer } from 'react'
import Dropzone from 'react-dropzone'
import {} from '../../utils/error'
import styled from '@emotion/styled'

function reducer(state, action) {
  switch (action.type) {
    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true, errorUpload: '' }
    case 'UPLOAD_SUCCESS':
      return {
        ...state,
        loadingUpload: false,
        errorUpload: ''
      }
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload }

    default:
      return state
  }
}

export default function UploadImage({ onUpload }) {
  const DropZoneBox = styled.div`
  background: '#eee',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '100px',
    padding: '10px',
    cursor: 'pointer',
    height: '150px',
    width: '400px',
    border: '2px dashed cyan',
    outline: 'none',
    margin: 'auto',
`

  const [{ loadingUpload }, dispatch] = useReducer(reducer, {
    loadingUpload: false,
    error: ''
  })

  const token = Cookies.get('userToken')

  const maxSize = 5000000

  const toast = useToast()

  const onDrop = async acceptedFiles => {
    const bodyFormData = new FormData()

    if (acceptedFiles.length > 0) {
      bodyFormData.append('file', acceptedFiles[0])

      try {
        dispatch({ type: 'UPLOAD_REQUEST' })
        await axios.post('/api/upload/image', bodyFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            authorization: `Bearer ${token}`
          }
        })
        dispatch({ type: 'UPLOAD_SUCCESS' })

        toast({
          title: 'عکس با موفقیت بارگذاری شد',
          status: 'success',
          isClosable: true
        })
        onUpload(acceptedFiles[0].name)
      } catch (err) {
        dispatch({ type: 'UPLOAD_FAIL', payload: err.message })
        toast({
          title: err.message,
          status: 'error',
          isClosable: true
        })
      }
    } else {
      toast({
        title: 'متاسفانه در بارگذاری عکس مشکلی پیش آمده است!',
        status: 'error',
        isClosable: true
      })
    }
  }

  return (
    <DropZoneBox>
      <Dropzone
        onDrop={onDrop}
        accept="image/jpeg,image/bmp,image/png"
        minSize={0}
        maxSize={maxSize}
        styles={{
          dropzoneReject: { borderColor: 'red', backgroundColor: '#DAA' }
        }}
      >
        {({
          getRootProps,
          getInputProps,
          isDragActive,
          isDragReject,
          rejectedFiles
        }) => {
          let isFileTooLarge = false
          if (rejectedFiles) {
            isFileTooLarge =
              rejectedFiles.length > 0 && rejectedFiles[0].size > maxSize
          }

          return (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {!isDragActive && 'برای بارگذاری عکس در این قسمت کلیک کنید !'}
              {isDragActive && !isDragReject && 'عکس را در این قسمت رها کنید'}
              {isDragReject && 'متاسفم فرمت عکس پذیرفته نمی شود !'}
              {isFileTooLarge && (
                <div className="text-danger mt-2">سایز عکس زیاد است</div>
              )}
            </div>
          )
        }}
      </Dropzone>
      {loadingUpload && <CircularProgress />}
    </DropZoneBox>
  )
}
