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
                  <FormLabel htmlFor="text  "> ?????? ?????????? ???????? </FormLabel>
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
                    placeholder="?????? ?????????? ????????"
                    {...register('text', {
                      required: {
                        value: true,
                        message: '???????? ?????? ?????????? ???????? ???? ???????? ????????????!'
                      },
                      minLength: {
                        value: 6,
                        message: '?????????? ?????? ?????? ?????????? ???????? 6 ?????????????? ??????'
                      },
                      pattern: {
                        value:
                          /^[????????????????????0123456789????????????????????????????????????????????????????????????????????  -,.???????-]+$/,
                        message: '???????? ?????? ?????????? ???????? ???? ???? ?????????? ???????? ????????????'
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
                    ?????? ???????? ???? ???????? ????????{' '}
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
                    placeholder="?????? ???????? ????????"
                    {...register('full_text', {
                      required: {
                        value: true,
                        message: '???????? ?????? ???????? ???????? ???? ???????? ????????????!'
                      }
                    })}
                  />
                  <FormErrorMessage>
                    {errors.full_text && errors.full_text.message}
                  </FormErrorMessage>
                </FormControl>
                {/* UploadFile */}
                <Text
                  mt={6}
                  mr={1}
                  color="#457b9d"
                  fontSize={{ base: '10px', md: '10px', lg: '15px' }}
                >
                  ?????? ???????? ???? ???????? ???????? ?? ???? ???????????? ?????? ???????? ???? ???? ????????????????
                  ????????????!
                </Text>

                <UploadFile onUpload={uploadHandler} />

                {mediaName && (
                  <FormControl isInvalid={errors.mediaName} isReadOnly>
                    <FormLabel htmlFor="mediaName  "> ?????? ???????? </FormLabel>
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
                  ?????????? ?? ?????????? ????????
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
