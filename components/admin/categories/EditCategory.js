import React, { useState } from 'react'
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

import styled from '@emotion/styled'

import { useRouter } from 'next/router'

import { useForm } from 'react-hook-form'

import axios from 'axios'

export default function EditCategory({ categories, category, token }) {
  const ShowForm = styled.form`
  width: '100%',
  maxWidth: 800,
  margin: '0 auto',
  direction: 'rtl',
  `

  const toast = useToast()

  const router = useRouter()

  const {
    handleSubmit,
    register,

    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      name: category.name
    }
  })

  const [parrentId, setParrenId] = useState(category.parrent_id)

  const submitHandler = async ({ name }) => {
    try {
      await axios.put(
        `/api/admin/category/${category._id}`,
        {
          name: name,
          parrent_id: parrentId
        },
        { headers: { authorization: `Bearer ${token}` } }
      )

      toast({
        title: 'اطلاعات با موفقیت ویرایش شد',
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
    </Box>
  )
}
