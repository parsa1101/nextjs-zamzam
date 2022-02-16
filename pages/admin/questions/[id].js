import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

import { useForm } from 'react-hook-form'

// import AdminLayout from '../../../components/layouts/admin'
const AdminLayout = dynamic(() => import('../../../components/layouts/admin'))

import {
  Button,
  Select,
  Input,
  InputGroup,
  Stack,
  FormControl,
  FormErrorMessage,
  useToast,
  Container,
  Box,
  Center,
  Image,
  Textarea
} from '@chakra-ui/react'

import { CheckIcon } from '@chakra-ui/icons'

import axios from 'axios'

import { getError } from '../../../utils/error'

import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
// import UploadImage from '../../../components/dropzone/UploadImage'
const UploadImage = dynamic(() =>
  import('../../../components/dropzone/UploadImage')
)
import db from '../../../utils/db'
import Question from '../../../models/question'

function EditQuestionScreen({ question }) {
  const token = Cookies.get('userToken')

  const userId = Cookies.get('userId')

  const [categories, setCategories] = useState([])

  const [catId2, setCatId] = useState('')

  const [pic_path, setPic_path] = useState('')

  function uploadHandler(fileName) {
    setPic_path(`/images/${fileName}`)
  }

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      text: '',
      full_text: '',
      slug: '',
      catId: ''
    }
  })

  const toast = useToast()

  const router = useRouter()

  /* eslint-disable react-hooks/exhaustive-deps */

  useEffect(() => {
    if (!userId) {
      return router.push('/login')
    }

    async function fetchCategories() {
      try {
        const { data } = await axios.get(`/api/admin/category/all`, {
          headers: { authorization: `Bearer ${token}` }
        })
        setCategories(data)
        reset({
          slug: question.slug,
          text: question.text,
          full_text: question.full_text,
          catId: question.catId
        })
        setCatId(question.catId)
        setPic_path(question.pic_path)
      } catch (err) {
        toast({
          title: getError(err),
          status: 'error',
          isClosable: true
        })
      }
    }
    if (userId) {
      fetchCategories()
    }
  }, [userId])

  const onSubmit = async values => {
    if (!pic_path) {
      toast({
        title: 'لطفا تصویر احکام را بارگذاری کنید!',
        status: 'error',
        isClosable: true
      })
      return
    }
    console.log(values, catId2)
    try {
      const { data } = await axios.put(
        `/api/admin/question/${question._id}`,
        {
          slug: values.slug,
          text: values.text,
          full_text: values.full_text,

          pic_path: pic_path,
          catId: catId2
        },
        { headers: { authorization: `Bearer ${token}` } }
      )
      toast({
        title: data.message,
        status: 'success',
        isClosable: true
      })
      return router.push('/admin/questions')
    } catch (err) {
      toast({
        title: getError(err),
        status: 'error',
        isClosable: true
      })
      return
    }
  }

  return (
    <AdminLayout>
      <Container maxW="container.xl" p={5}>
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" bg="white">
          <Box
            borderWidth="1px"
            m={5}
            borderRadius="lg"
            borderColor="gray"
            overflow="hidden"
            bg="white"
          >
            <Center mt={1}>
              <UploadImage onUpload={uploadHandler} />
            </Center>
            {pic_path ? (
              <Box
                flexShrink={0}
                mt={{ base: 4, md: 15 }}
                ml={{ md: 6 }}
                textAlign="center"
              >
                <Image
                  borderColor="whiteAlpha.800"
                  borderWidth={2}
                  borderStyle="solid"
                  maxWidth="200px"
                  display="inline-block"
                  borderRadius="full"
                  src={pic_path}
                  alt="Profile image"
                />
              </Box>
            ) : (
              ''
            )}
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack
                spacing={4}
                p="1rem"
                backgroundColor="whiteAlpha.900"
                boxShadow="md"
              >
                <FormControl isRequired isInvalid={errors.slug}>
                  <InputGroup>
                    <Input
                      type="text"
                      placeholder="slug"
                      id="slug"
                      name="slug"
                      {...register('slug', {
                        required: {
                          value: true
                        },
                        message: 'لطفا slug را وارد نمایید!',
                        pattern: {
                          value: /^[آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی  -]+$/,
                          message: 'لطفا slug را به فارسی وارد نمایید'
                        }
                      })}
                    />
                  </InputGroup>
                  <FormErrorMessage>
                    {errors.slug && errors.slug.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isRequired isInvalid={errors.text}>
                  <InputGroup>
                    <Input
                      type="text"
                      placeholder="متن کوتاه احکام"
                      id="text"
                      name="text"
                      {...register('text', {
                        required: {
                          value: true,
                          message: 'لطفا  متن کوتاه سوال را وارد نمایید!'
                        },
                        pattern: {
                          value: /^[آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی  ,.-]+$/,
                          message: 'لطفا متن کوتاه سوال را به فارسی وارد نمایید'
                        }
                      })}
                    />
                  </InputGroup>
                  <FormErrorMessage>
                    {errors.text && errors.text.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isRequired isInvalid={errors.full_text}>
                  <InputGroup>
                    <Textarea
                      resize={true}
                      rows={5}
                      placeholder="متن کامل احکام"
                      id="full_text"
                      name="full_text"
                      {...register('full_text', {
                        required: {
                          value: true,
                          message: 'لطفا  متن کامل سوال را وارد نمایید!'
                        }
                      })}
                    />
                  </InputGroup>
                  <FormErrorMessage>
                    {errors.full_text && errors.full_text.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isRequired isInvalid={errors.catId}>
                  <Select
                    name="catId"
                    id="catId"
                    placeholder="انتخاب دسته بندی"
                    onChange={e => setCatId(e.target.value)}
                    value={catId2}
                  >
                    {categories.map(item => (
                      <option key={item._id} value={item._id}>
                        {item.name}
                      </option>
                    ))}
                  </Select>
                  <FormErrorMessage>
                    {errors.catId && errors.catId.message}
                  </FormErrorMessage>
                </FormControl>
                <Center>
                  <Button
                    borderRadius={0}
                    isLoading={isSubmitting}
                    type="submit"
                    colorScheme="teal"
                    variant="solid"
                    rightIcon={<CheckIcon />}
                  >
                    ذخیره احکام
                  </Button>
                </Center>
              </Stack>
            </form>
          </Box>
        </Box>
      </Container>
    </AdminLayout>
  )
}

export const getStaticPaths = async () => {
  await db.connect()

  const questions = await Question.find({})
  await db.disconnect()

  // generate the paths
  const paths = questions.map(item => ({
    params: { id: item._id.toString() }
  }))

  return {
    paths,
    fallback: true
  }
}

export async function getStaticProps(context) {
  const { params } = context
  const { id } = params

  await db.connect()
  const question = await Question.findById(id).lean()

  await db.disconnect()
  return {
    props: {
      question: db.convertDocToObjInTemporaryQuestion(question)
    }
  }
}

export default dynamic(() => Promise.resolve(EditQuestionScreen), {
  ssr: false
})
