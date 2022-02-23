import React, { useState } from 'react'
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
  Center,
  Text,
  Box,
  useToast,
  Container,
  Image,
  useColorModeValue
} from '@chakra-ui/react'

import { useForm } from 'react-hook-form'
const UploadFile = dynamic(() =>
  import('../../../components/dropzone/UploadFile')
)
const Layout = dynamic(() => import('../../../components/layouts/article'))
const Section = dynamic(() => import('../../../components/section'))

import axios from 'axios'
import db from '../../../utils/db'
import TemporaryQuestion from '../../../models/temporaryQuestion'

export default function SaveAnswerScreen({ token, userId, question }) {
  const [mediaName, setMediaName] = useState('')

  const toast = useToast()

  const [formData, setFormData] = useState({
    text: '',
    full_text: '',
    mediaName: ''
  })

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
    // ctx.setUploadInfo('', '')
    try {
      const { data } = await axios.post(
        `/api/answer/temporary`,
        {
          text,
          mediaPath: mediaName,
          full_text,
          questionId: question._id,
          userId,
          fileExtension
        },
        { headers: { authorization: `Bearer ${token}` } }
      )

      setMediaName('')

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
    <Layout title="show-categories">
      <Container>
        <Box
          borderRadius="lg"
          mb={10}
          p={10}
          textAlign="center"
          bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
        >
          {question.text}
        </Box>
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          bg="whiteAlpha.900"
        >
          <Section delay={0.1}>
            <Center my={6}>
              <Image src="/images/works/amembo_icon.png" alt="icon" />
            </Center>
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
                  <FormLabel htmlFor="full_text  ">
                    {' '}
                    متن جواب به صورت کامل{' '}
                  </FormLabel>
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
                  borderWidth="1px"
                  borderRadius="lg"
                  mb={10}
                  textAlign="center"
                  bg={'#d8e2dc'}
                >
                  <Text mt={6} mr={1} color="#457b9d">
                    اگر جواب به صورت صوتی و یا تصویری است لطفا آن را بارگذاری
                    نمایید!
                  </Text>

                  <Center mt={5}>
                    <UploadFile onUpload={uploadHandler} />
                  </Center>
                </Box>

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
          </Section>
        </Flex>
      </Container>
    </Layout>
  )
}
export async function getServerSideProps(context) {
  const isExpert = context.req.cookies['isExpert']
  const token = context.req.cookies['userToken']
  const userId = context.req.cookies['userId']
  const { params } = context
  const { questionId } = params

  if (!isExpert) {
    return {
      redirect: {
        permanent: false,
        destination: '/401'
      },
      props: {}
    }
  }
  await db.connect()

  const question = await TemporaryQuestion.findById(questionId).lean()

  await db.disconnect()
  return {
    props: {
      token,
      userId,
      question: db.convertDocToObjInTemporaryQuestion(question)
    }
  }
}
