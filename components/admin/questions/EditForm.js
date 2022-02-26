import React, { useState } from 'react'
import dynamic from 'next/dynamic'

import { useForm } from 'react-hook-form'

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

import { useRouter } from 'next/router'

const UploadImage = dynamic(() => import('../../dropzone/UploadImage'))

export default function EditForm({ token, categories, question }) {
  const [catId2, setCatId] = useState('')

  const [pic_path, setPic_path] = useState('')

  function uploadHandler(fileName) {
    setPic_path(`/images/${fileName}`)
  }

  const {
    handleSubmit,
    register,

    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      text: question.text,
      full_text: question.full_text,
      slug: question.slug,
      catId: question.catId
    }
  })

  const toast = useToast()

  const router = useRouter()

  const onSubmit = async values => {
    if (!pic_path) {
      toast({
        title: 'لطفا تصویر احکام را بارگذاری کنید!',
        status: 'error',
        isClosable: true
      })
      return
    }

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
        title: err.message,
        status: 'error',
        isClosable: true
      })
      return
    }
  }
  return (
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
  )
}
