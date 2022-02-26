import React, { useState } from 'react'
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
  Box,
  Center,
  Image,
  Textarea,
  SimpleGrid,
  Container
} from '@chakra-ui/react'

import { CheckIcon, AddIcon } from '@chakra-ui/icons'

import axios from 'axios'

import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

const UploadImage = dynamic(() => import('../../dropzone/UploadImage'))

export default function CreateForm({ userId, categories, token }) {
  const [catId, setCatId] = useState('')

  const [mediaName, setMediaName] = useState('')

  const [page, setPage] = useState(false)

  function uploadHandler(fileName) {
    setMediaName(fileName)
  }

  const {
    handleSubmit,
    register,

    formState: { errors, isSubmitting }
  } = useForm()

  const toast = useToast()

  const router = useRouter()

  const onSubmit = async values => {
    if (!mediaName) {
      toast({
        title: 'لطفا تصویر احکام را بارگذاری کنید!',
        status: 'error',
        isClosable: true
      })
      return
    }
    try {
      const { data } = await axios.post(
        `/api/admin/question/all`,
        {
          slug: values.slug,
          text: values.text,
          full_text: values.full_text,
          userId: userId,
          pic_path: mediaName,
          catId: catId
        },
        { headers: { authorization: `Bearer ${token}` } }
      )
      toast({
        title: data.message,
        status: 'success',
        isClosable: true
      })
      if (!page) {
        return router.push('/admin/questions')
      } else {
        router.push(`/admin/questions/answer/${data.id}`)
      }
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
          {mediaName ? (
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
                src={`/images/${mediaName}`}
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
                        value:
                          /^[آابپتثجچحخدذرزژسشصضطظعغفقکگلمنئوهی  -,.،؟?؟-]+$/,
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
                        value:
                          /^[آابپتثجچحخدذرزژسشصضطظعغفقکگلمنئوهی  -,.،؟?؟-]+$/,
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
            </Stack>

            <SimpleGrid columns={2} spacing={5}>
              <Box>
                <Button
                  onClick={() => setPage(false)}
                  borderRadius={0}
                  isLoading={isSubmitting}
                  type="submit"
                  colorScheme="teal"
                  variant="solid"
                  isFullWidth
                  rightIcon={<CheckIcon />}
                >
                  ذخیره احکام
                </Button>
              </Box>
              <Box>
                <Button
                  borderRadius={0}
                  isLoading={isSubmitting}
                  type="submit"
                  colorScheme="telegram"
                  variant="solid"
                  isFullWidth
                  rightIcon={<AddIcon />}
                  onClick={() => setPage(true)}
                >
                  درج جواب
                </Button>
              </Box>
            </SimpleGrid>
          </form>
        </Box>
      </Box>
    </Container>
  )
}
