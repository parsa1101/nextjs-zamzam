import {
  Button,
  FormControl,
  FormErrorMessage,
  Stack,
  Textarea,
  useToast
} from '@chakra-ui/react'
import React, { useState } from 'react'

import { useForm } from 'react-hook-form'
import axios from 'axios'
import Cookies from 'js-cookie'

export default function SendQuestion({ onClicked, id, catId }) {
  const [question, setQuestion] = useState('')

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm()

  const toast = useToast()

  const userId = Cookies.get('userId')
  const onSubmit = async () => {
    try {
      const { data } = await axios.post(`/api/questions/addNew`, {
        userId,
        text: question,
        parentId: id,
        catId: catId
      })

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
    onClicked()
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack
        spacing={4}
        p="1rem"
        backgroundColor="whiteAlpha.900"
        boxShadow="md"
      >
        {/* question input */}
        <FormControl isInvalid={errors.question}>
          <Textarea
            id="question"
            name="question"
            placeholder="متن سوال"
            {...register('question', {
              required: {
                value: true,
                message: 'لطفا متن سوال را وارد نمایید!'
              },
              minLength: {
                value: 11,
                message: ' طول متن سوال 11 کاراکتر است'
              },

              pattern: {
                value:
                  /^[۰۱۲۳۴۵۶۷۸۹0123456789آابپتثجچحخدذرزژسشصضطظعغفقکگلمنئوهی  -,.،؟?؟-]+$/,
                message: 'لطفا متن سوال را به فارسی وارد نمایید'
              }
            })}
            resize={true}
            rows={8}
            _placeholder={{ color: '#457b9d' }}
            onChange={e => {
              setQuestion(e.target.value)
            }}
          />

          <FormErrorMessage>
            {errors.question && errors.question.message}
          </FormErrorMessage>
        </FormControl>

        <Button
          borderRadius={0}
          isLoading={isSubmitting}
          type="submit"
          variant="solid"
          colorScheme="teal"
          width="full"
        >
          ارسال سوال
        </Button>
      </Stack>
    </form>
  )
}
