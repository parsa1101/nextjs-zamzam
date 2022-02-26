import { CheckIcon, DeleteIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  InputGroup,
  SimpleGrid,
  Stack,
  Textarea,
  useToast,
  HStack
} from '@chakra-ui/react'

import dynamic from 'next/dynamic'

import { useRouter } from 'next/router'

import React, { useState } from 'react'

import { useForm } from 'react-hook-form'

import axios from 'axios'

import ReactPlayer from 'react-player'

const UploadFile = dynamic(() =>
  import('../../../components/dropzone/UploadFile')
)
export default function EditAnswer({ answer, token }) {
  const toast = useToast()

  const router = useRouter()

  const [filename, setFileName] = useState(
    answer.media_path ? answer.media_path : ''
  )

  const [kind, setKind] = useState(answer.kind)

  const {
    handleSubmit,
    register,

    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      text: answer.text,
      full_text: answer.full_text
    }
  })
  function uploadHandler(fileName) {
    setFileName(`/media/${fileName}`)
    setKind(fileName.split('.').pop())
  }

  const onSubmit = async values => {
    try {
      const { data } = await axios.put(
        `/api/admin/question/editAnswer/${answer._id}`,
        {
          text: values.text,
          full_text: values.full_text,
          media_path: filename,
          kind: kind
        },
        { headers: { authorization: `Bearer ${token}` } }
      )
      toast({
        title: data.message,
        status: 'success',
        isClosable: true
      })
      router.push('/admin/questions')
    } catch (err) {
      toast({
        title: err.message,
        status: 'error',
        isClosable: true
      })
      return
    }
  }

  async function deleteFileHandler() {
    try {
      await axios.get(`/api/admin/question/editAnswer/${answer._id}`, {
        headers: { authorization: `Bearer ${token}` }
      })
      setKind('0')
      setFileName('')
      toast({
        title: 'فایل با موفقیت حذف شد',
        status: 'success',
        isClosable: true
      })
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
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" bg="white">
      <Box
        borderWidth="1px"
        borderRadius="lg"
        borderColor="gray"
        overflow="hidden"
        bg="white"
        alignItems="center"
        justifyContent="space-between"
        m={15}
      >
        <HStack p={10}>
          <Box
            shadow="md"
            borderWidth="1px"
            flex="1"
            borderRadius="md"
            alignItems="center"
          >
            <UploadFile onUpload={uploadHandler} />
            {kind !== '0' && (
              <div className="player-wrapper">
                <ReactPlayer
                  width="100%"
                  height="100%"
                  url={filename}
                  controls={true}
                  className="react-player"
                />
              </div>
            )}
          </Box>
        </HStack>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack
            spacing={4}
            p="1rem"
            backgroundColor="whiteAlpha.900"
            boxShadow="md"
          >
            <FormControl isInvalid={errors.text}>
              <InputGroup>
                <Input
                  type="text"
                  placeholder="متن کوتاه احکام"
                  id="text"
                  name="text"
                  {...register('text', {
                    required: {
                      value: true,
                      message: 'لطفا  متن کوتاه جواب را وارد نمایید!'
                    },
                    pattern: {
                      value:
                        /^[آابپتثجچحخدذرزژسشصضطظعغفقکگلمنئوهی  -,.،؟?؟-]+$/,
                      message: 'لطفا متن کوتاه جواب را به فارسی وارد نمایید'
                    }
                  })}
                />
              </InputGroup>
              <FormErrorMessage>
                {errors.text && errors.text.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.full_text}>
              <InputGroup>
                <Textarea
                  resize={true}
                  rows={5}
                  placeholder="متن کامل جواب"
                  id="full_text"
                  name="full_text"
                  {...register('full_text', {
                    required: {
                      value: true,
                      message: 'لطفا  متن کامل جواب را وارد نمایید!'
                    }
                  })}
                />
              </InputGroup>
              <FormErrorMessage>
                {errors.full_text && errors.full_text.message}
              </FormErrorMessage>
            </FormControl>
          </Stack>

          <SimpleGrid columns={2} spacing={5}>
            <Box>
              <Button
                borderRadius={0}
                isLoading={isSubmitting}
                type="submit"
                colorScheme="teal"
                variant="solid"
                rightIcon={<CheckIcon />}
                isFullWidth
              >
                ذخیره جواب
              </Button>
            </Box>
            <Box>
              <Button
                borderRadius={0}
                isLoading={isSubmitting}
                colorScheme="red"
                variant="solid"
                rightIcon={<DeleteIcon />}
                onClick={deleteFileHandler}
                isFullWidth
              >
                حذف فایل
              </Button>
            </Box>
          </SimpleGrid>
        </form>
      </Box>
    </Box>
  )
}
