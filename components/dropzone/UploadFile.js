import { Spinner, useToast } from '@chakra-ui/react'
import axios from 'axios'
import Cookies from 'js-cookie'
import React, { useContext, useReducer } from 'react'
import Dropzone from 'react-dropzone'
import { getError } from '../../utils/error'
import LayoutContext from '../../utils/Store'
// import useStyles from '../../utils/style'

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

export default function UploadFile({ onUpload }) {
  const classes = useStyles()

  const toast = useToast()

  const [{ loadingUpload }, dispatch] = useReducer(reducer, {
    loadingUpload: false,
    error: ''
  })

  const token = Cookies.get('userToken')

  const maxSize = 5000000

  const ctx = useContext(LayoutContext)

  const onDrop = async acceptedFiles => {
    const bodyFormData = new FormData()

    if (acceptedFiles.length > 0) {
      bodyFormData.append('file', acceptedFiles[0])

      try {
        dispatch({ type: 'UPLOAD_REQUEST' })
        const { data } = await axios.post('/api/upload/media', bodyFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            authorization: `Bearer ${token}`
          }
        })
        ctx.setUploadInfo('success', data)
        dispatch({ type: 'UPLOAD_SUCCESS' })

        toast({
          title: 'فایل با موفقیت بارگذاری شد',
          status: 'success',
          isClosable: true
        })
        onUpload(acceptedFiles[0].name)
      } catch (err) {
        dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) })
        toast({
          title: getError(err),
          status: 'error',
          isClosable: true
        })
        ctx.setUploadInfo('error', getError(err))
      }
    } else {
      // enqueueSnackbar('متاسفانه در بارگذاری فایل مشکلی پیش آمده است!', {
      //   variant: 'error'
      // })
      ctx.setUploadInfo(
        'error',
        'متاسفانه در بارگذاری فایل مشکلی پیش آمده است!'
      )
      dispatch({
        type: 'UPLOAD_FAIL',
        payload: 'متاسفانه در بارگذاری فایل مشکلی پیش آمده است!'
      })
      toast({
        title: 'متاسفانه در بارگذاری فایل مشکلی پیش آمده است!',
        status: 'error',
        isClosable: true
      })
    }
  }

  return (
    <div className={classes.dropzone}>
      <Dropzone
        onDrop={onDrop}
        accept="audio/mpeg,video/mp4,video/mpeg"
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
              {!isDragActive && 'برای بارگذاری فایل در این قسمت کلیک کنید !'}
              {isDragActive && !isDragReject && 'فایل را در این قسمت رها کنید'}
              {isDragReject && 'متاسفم فرمت فایل پذیرفته نمی شود !'}
              {isFileTooLarge && (
                <div className="text-danger mt-2">سایز فایل زیاد است</div>
              )}
            </div>
          )
        }}
      </Dropzone>
      {loadingUpload && <Spinner />}
    </div>
  )
}
