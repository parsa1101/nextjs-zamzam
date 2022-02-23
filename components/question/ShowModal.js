import React, { useContext, useState } from 'react'
import dynamic from 'next/dynamic'

import {
  FormErrorMessage,
  FormControl,
  Input,
  FormLabel,
  Textarea,
  Button,
  Stack,
  Flex,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Center,
  Text,
  Box,
  useToast
} from '@chakra-ui/react'
import Cookies from 'js-cookie'
import { useForm } from 'react-hook-form'
const UploadFile = dynamic(() => import('../dropzone/UploadFile'))
import LayoutContext from '../../utils/Store'
import axios from 'axios'

export default function ShowModal({ id }) {
  const token = Cookies.get('userToken')

  const userId = Cookies.get('userId')

  const [mediaName, setMediaName] = useState('')

  const toast = useToast()

  const [formData, setFormData] = useState({
    text: '',
    full_text: '',
    mediaName: ''
  })

  // const [saveForm, setSaveForm] = useState({
  //   status: '',
  //   message: ''
  // })

  const ctx = useContext(LayoutContext)

  const {
    handleSubmit,
    register,

    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      text: formData.text,
      full_text: formData.full_text
    }
  })

  function uploadHandler(fileName) {
    setMediaName(fileName)
  }

  async function onSubmit({ text, full_text }) {
    let fileExtension = '0'
    if (mediaName) {
      fileExtension = mediaName.split('.').pop()
    }
    ctx.setUploadInfo('', '')
    try {
      const { data } = await axios.post(
        `/api/answer/temporary`,
        {
          text,
          mediaPath: mediaName,
          full_text,
          questionId: id,
          userId,
          fileExtension
        },
        { headers: { authorization: `Bearer ${token}` } }
      )

      setMediaName('')
      // setSaveForm(prev => ({
      //   ...prev,
      //   status: 'success',
      //   message: data.message
      // }))
      toast({
        title: data.message,
        status: 'success',
        isClosable: true
      })
    } catch (err) {
      toast({
        title: err.message,
        status: 'error',
        isClosable: true
      })
    }
  }

  return (
    <Flex
      width="100%"
      flexDir="column"
      bg="#f8f9fa"
      rounded={'lg'}
      boxShadow={'lg'}
      pt={5}
      pb={20}
    >
      {/* {saveForm.status === 'success' && (
        <Alert status="success">
          <AlertIcon />
          <AlertDescription>{saveForm.message}</AlertDescription>
        </Alert>
      )} */}
      {/* {saveForm.status === 'error' && (
        <Alert status="error">
          <AlertIcon />
          <AlertDescription>{saveForm.message}</AlertDescription>
        </Alert>
      )} */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={5}>
          <FormControl isInvalid={errors.text}>
            <FormLabel htmlFor="text  "> متن کوتاه جواب </FormLabel>
            <Input
              _placeholder={{ color: '#457b9d' }}
              onChange={e => {
                setFormData(prev => ({
                  ...prev,
                  text: e.target.value
                }))
              }}
              id="text"
              name="text"
              defaultValue=""
              placeholder="متن کوتاه جواب"
              {...register('text', {
                required: {
                  value: true,
                  message: 'لطفا متن کوتاه جواب را وارد نمایید!'
                },
                minLength: {
                  value: 6,
                  message: 'حداقل طول متن کوتاه جواب 6 کاراکتر است'
                },
                pattern: {
                  value:
                    /^[۰۱۲۳۴۵۶۷۸۹0123456789آابپتثجچحخدذرزژسشصضطظعغفقکگلمنئوهی  -,.،؟?؟-]+$/,
                  message: 'لطفا متن کوتاه جواب را به فارسی وارد نمایید'
                }
              })}
            />
            <FormErrorMessage>
              {errors.text && errors.text.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.full_text}>
            <FormLabel htmlFor="full_text  "> متن جواب به صورت کامل </FormLabel>
            <Textarea
              resize={true}
              rows={10}
              _placeholder={{ color: '#457b9d' }}
              onChange={e => {
                setFormData(prev => ({
                  ...prev,
                  full_text: e.target.value
                }))
              }}
              id="full_text"
              name="full_text"
              defaultValue=""
              placeholder="متن کامل جواب"
              {...register('full_text', {
                required: {
                  value: true,
                  message: 'لطفا متن کامل جواب را وارد نمایید!'
                }
              })}
            />
            <FormErrorMessage>
              {errors.full_text && errors.full_text.message}
            </FormErrorMessage>
          </FormControl>
          {/* UploadFile */}
          <Box
            maxW="100%"
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
          >
            <Text mt={6} mr={1} fontSize="15px" color="#457b9d">
              اگر جواب به صورت صوتی و یا تصویری است لطفا آن را بارگذاری کنید:{' '}
            </Text>

            <Center mt={1}>
              <UploadFile onUpload={uploadHandler} />
            </Center>
          </Box>

          {ctx.uploadInfo.status === 'error' && (
            <Alert status="error">
              <AlertIcon />
              <AlertTitle mr={2}>خطا!</AlertTitle>
              <AlertDescription>{ctx.uploadInfo.message}</AlertDescription>
              <CloseButton position="absolute" right="8px" top="8px" />
            </Alert>
          )}
          {ctx.uploadInfo.status === 'success' && (
            <Alert status="success">
              <AlertIcon />
              <AlertTitle mr={2}> بارگذاری فایل</AlertTitle>
              <AlertDescription>با موفقیت انجام شد</AlertDescription>
              <CloseButton position="absolute" right="8px" top="8px" />
            </Alert>
          )}
          {mediaName && (
            <FormControl isInvalid={errors.mediaName} isReadOnly>
              <FormLabel htmlFor="mediaName  "> نام فایل </FormLabel>
              <Input
                _placeholder={{ color: '#457b9d' }}
                id="mediaName"
                value={mediaName}
              />
            </FormControl>
          )}

          <Button
            isLoading={isSubmitting}
            type="submit"
            bg={'#457b9d'}
            color={'white'}
            w="full"
            _hover={{
              bg: 'blue.500'
            }}
          >
            تایید و ذخیره جواب
          </Button>
        </Stack>
      </form>
    </Flex>
  )
}
