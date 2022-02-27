import React, { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

import { useForm } from 'react-hook-form'

import styled from '@emotion/styled'
import {
  Button,
  Center,
  Box,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Select,
  useToast
} from '@chakra-ui/react'
export default function InsertCategory({ token, categories }) {
  const toast = useToast()

  const router = useRouter()

  const ShowForm = styled.form`
    width: '100%',
    maxWidth: 800,
    margin: '0 auto',
    direction: 'rtl',
    `

  const {
    handleSubmit,
    register,

    formState: { errors, isSubmitting }
  } = useForm()

  const [parrentId, setParrenId] = useState('0')
  console.log(parrentId)

  const submitHandler = async ({ name }) => {
    try {
      await axios.post(
        `/api/admin/category/add`,
        {
          name: name,
          parrent_id: parrentId
        },
        { headers: { authorization: `Bearer ${token}` } }
      )
      toast({
        title: 'اطلاعات با موفقیت ثبت شد',
        status: 'success',
        isClosable: true
      })

      return router.push('/admin/category')
    } catch (err) {
      toast({
        title: err.message,
        status: 'error',
        isClosable: true
      })
    }
  }
  return (
    <Center>
      <Box w="500px" h="auto" bg="white" borderRadius="2px" mt={10} mb={20}>
        <ShowForm onSubmit={handleSubmit(submitHandler)}>
          <FormControl isInvalid={errors.name}>
            <FormLabel htmlFor="name">نام دسته بندی :</FormLabel>
            <Input
              _placeholder={{ color: '#457b9d' }}
              id="name"
              {...register('name', {
                required: {
                  value: true,
                  message: 'لطفا نام دسته بندی را وارد نمایید!'
                },

                pattern: {
                  value: /^[آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی ]+$/,
                  message: 'لطفا نام دسته بندی را به درستی وارد نمایید'
                }
              })}
            />
            <FormErrorMessage>
              {errors.name && errors.name.message}
            </FormErrorMessage>
          </FormControl>

          {/* categories */}
          <FormControl isInvalid={errors.category}>
            <FormLabel htmlFor="category"> انتخاب والد</FormLabel>
            <Select
              name="category"
              id="category"
              onChange={e => setParrenId(e.target.value)}
              value={parrentId}
            >
              <option value={0}>دسته اصلی</option>
              {categories.map(item => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </Select>
          </FormControl>
          <Button
            mt={5}
            isLoading={isSubmitting}
            type="submit"
            bg={'#457b9d'}
            color={'white'}
            w="full"
            _hover={{
              bg: 'blue.500'
            }}
          >
            ذخیره
          </Button>
        </ShowForm>
      </Box>
    </Center>
  )
}
