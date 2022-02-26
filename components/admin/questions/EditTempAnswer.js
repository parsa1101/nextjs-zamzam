import React, { useRef, useState } from 'react'

import { useForm } from 'react-hook-form'

import dynamic from 'next/dynamic'

const UploadFile = dynamic(() =>
  import('../../../components/dropzone/UploadFile')
)
import {
  Button,
  Input,
  InputGroup,
  Stack,
  FormControl,
  FormErrorMessage,
  useToast,
  Box,
  Textarea,
  SimpleGrid,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  HStack
} from '@chakra-ui/react'

import { CheckIcon, DeleteIcon } from '@chakra-ui/icons'

import axios from 'axios'

import { useRouter } from 'next/router'

import ReactPlayer from 'react-player'

export default function EditTempAnswer({ answer, token }) {
  const initialFocusRef = useRef()

  const [filename, setFileName] = useState(answer.media_path)

  const [kind, setKind] = useState(answer.kind)

  const {
    handleSubmit,
    register,

    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      text: '',
      full_text: ''
    }
  })

  const toast = useToast()

  const router = useRouter()

  function uploadHandler(fileName) {
    setFileName(`/media/${fileName}`)
    setKind(fileName.split('.').pop())
  }

  const onSubmit = async values => {
    try {
      const { data } = await axios.post(
        `/api/admin/answer/temporary/${answer._id}`,
        {
          text: values.text,
          full_text: values.full_text,
          media_path: filename,
          kind: kind,
          userId: answer.userId
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
      await axios.put(
        `/api/admin/answer/temporary/${answer._id}`,
        {
          kind: kind
        },
        {
          headers: { authorization: `Bearer ${token}` }
        }
      )
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

  async function deleteHandler() {
    try {
      const { data } = await axios.delete(
        `/api/admin/answer/temporary/${answer._id}`,
        {
          headers: { authorization: `Bearer ${token}` }
        }
      )

      toast({
        title: data.message,
        status: 'success',
        isClosable: true
      })
      router.push(`/admin/questions/temp/answers/${answer.questionId}`)
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
                    value: /^[آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی  ,.]+$/,
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

        <SimpleGrid minChildWidth="120px" spacing="40px">
          <Box>
            <Popover
              initialFocusRef={initialFocusRef}
              placement="bottom"
              closeOnBlur={false}
            >
              <PopoverTrigger>
                <Button
                  borderRadius={0}
                  colorScheme="telegram"
                  variant="solid"
                  rightIcon={<CheckIcon />}
                  isFullWidth
                >
                  تایید جواب
                </Button>
              </PopoverTrigger>
              <PopoverContent
                color="white"
                bg="blue.800"
                borderColor="blue.800"
              >
                <PopoverHeader pt={4} fontWeight="bold" border="0">
                  هشدار!
                </PopoverHeader>
                <PopoverArrow />
                <PopoverCloseButton />

                <PopoverBody>
                  درصورت تایید جواب،تمام جوابهای ثبت شده حذف می شود و سوال به
                  همراه جواب در لیست احکام نمایش داده خواهد شد.
                </PopoverBody>
                <PopoverFooter
                  border="0"
                  d="flex"
                  justifyContent="space-between"
                  pb={4}
                >
                  <Button type="submit" colorScheme="green">
                    تایید
                  </Button>
                </PopoverFooter>
              </PopoverContent>
            </Popover>
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
          <Box>
            <Button
              borderRadius={0}
              isLoading={isSubmitting}
              colorScheme="red"
              variant="solid"
              rightIcon={<DeleteIcon />}
              onClick={deleteHandler}
              isFullWidth
            >
              حذف جواب
            </Button>
          </Box>
        </SimpleGrid>
      </form>
    </Box>
  )
}
