import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Multiselect } from 'multiselect-react-dropdown'

import {
  Button,
  Center,
  Input,
  InputGroup,
  Stack,
  InputLeftElement,
  FormControl,
  FormErrorMessage,
  useToast,
  chakra,
  Box
} from '@chakra-ui/react'

import { MdAlternateEmail, MdPhoneIphone } from 'react-icons/md'

import axios from 'axios'

import { FaLock } from 'react-icons/fa'
const CFaLock = chakra(FaLock)

export default function CreateNewUser({ token, roles }) {
  const [selectedRoles, setSelectedRoles] = useState([])

  const router = useRouter()
  const {
    handleSubmit,
    register,

    formState: { errors, isSubmitting }
  } = useForm()

  const toast = useToast()

  const onSubmit = async values => {
    if (values.password && values.password !== values.rePassword) {
      toast({
        title: 'لطفا رمز عبور و تکرار رمز عبور را به درستی وارد نمایید',
        status: 'error',
        isClosable: true
      })

      return
    }
    try {
      await axios.post(
        `/api/admin/users/insert`,
        {
          nameFamily: values.nameFamily,
          email: values.email,
          mobile: values.mobile,
          password: values.password,
          userRoles: selectedRoles
        },
        { headers: { authorization: `Bearer ${token}` } }
      )
      toast({
        title: 'کاربر مورد نظر با موفقیت ثبت شد.',
        status: 'success',
        isClosable: true
      })
      router.push('/admin/users')
    } catch (err) {
      toast({
        title: err.message,
        status: 'error',
        isClosable: true
      })
      return
    }
  }

  function onSelect(selectedList, selectedItem) {
    setSelectedRoles(prev => [...prev, selectedItem])
  }

  function onRemove(selectedList, removedItem) {
    const array = selectedList.filter(item => {
      return item !== removedItem
    })
    setSelectedRoles(array)
  }
  return (
    <Center>
      <Box w="500px" h="auto" bg="white" borderRadius="2px" mt={10} mb={20}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack
            spacing={4}
            p="1rem"
            backgroundColor="whiteAlpha.900"
            boxShadow="md"
          >
            <FormControl isRequired isInvalid={errors.nameFamily}>
              <InputGroup>
                <Input
                  type="text"
                  placeholder="نام و نام خانوادگی"
                  id="nameFamily"
                  name="nameFamily"
                  {...register('nameFamily', {
                    required: {
                      value: true,
                      message: 'لطفا  نام و نام خانوادگی را وارد نمایید!'
                    },
                    pattern: {
                      value: /^[آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی ]+$/,
                      message: 'لطفا نام و نام خانوادگی را به فارسی وارد نمایید'
                    }
                  })}
                />
              </InputGroup>
              <FormErrorMessage>
                {errors.nameFamily && errors.nameFamily.message}
              </FormErrorMessage>
            </FormControl>
            {/* email input */}
            <FormControl isRequired isInvalid={errors.email}>
              <InputGroup>
                <InputLeftElement pointerEvents="none" color="gray.300">
                  {<MdAlternateEmail color="gray.300" />}
                </InputLeftElement>
                <Input
                  type="email"
                  placeholder="ایمیل"
                  id="email"
                  name="email"
                  {...register('email', {
                    required: {
                      value: true,
                      message: 'لطفا  ایمیل را وارد نمایید!'
                    }
                  })}
                />
              </InputGroup>
              <FormErrorMessage>
                {errors.email && errors.email.message}
              </FormErrorMessage>
            </FormControl>
            {/* mobile input */}
            <FormControl isRequired isInvalid={errors.mobile}>
              <InputGroup>
                <InputLeftElement pointerEvents="none" color="gray.300">
                  <MdPhoneIphone color="gray.300" />
                </InputLeftElement>
                <Input
                  type="number"
                  id="mobile"
                  name="mobile"
                  placeholder="شماره تلفن همراه"
                  {...register('mobile', {
                    required: {
                      value: true,
                      message: 'لطفا شماره تلفن همراه را وارد نمایید!'
                    },
                    minLength: {
                      value: 11,
                      message: ' طول شماره تلفن همراه 11 کاراکتر است'
                    },
                    maxLength: {
                      value: 11,
                      message: ' طول شماره تلفن همراه 11 کاراکتر است'
                    },
                    pattern: {
                      value: /[0-9]*/,
                      message: 'لطفا شماره تلفن همراه را به درستی وارد نمایید'
                    }
                  })}
                />
              </InputGroup>
              <FormErrorMessage>
                {errors.mobile && errors.mobile.message}
              </FormErrorMessage>
            </FormControl>
            {/* password input */}
            <FormControl isInvalid={errors.password}>
              <InputGroup>
                <InputLeftElement pointerEvents="none" color="gray.300">
                  <CFaLock color="gray.300" />
                </InputLeftElement>
                <Input
                  type="text"
                  id="password"
                  name="password"
                  placeholder="رمز عبور"
                  {...register('password', {
                    required: {
                      value: true,
                      message: 'لطفا  رمز عبور را وارد نمایید!'
                    },
                    minLength: {
                      value: 9,
                      message: ' حداقل رمز عبور 9 کاراکتر است'
                    }
                  })}
                />
              </InputGroup>

              <FormErrorMessage>
                {errors.password && errors.password.message}
              </FormErrorMessage>
            </FormControl>
            {/* rePassword input */}
            <FormControl isInvalid={errors.rePassword}>
              <InputGroup>
                <InputLeftElement pointerEvents="none" color="gray.300">
                  <CFaLock color="gray.300" />
                </InputLeftElement>
                <Input
                  type="text"
                  placeholder="تکرار رمز عبور"
                  id="rePassword"
                  name="rePassword"
                  {...register('rePassword', {
                    required: {
                      value: true,
                      message: 'لطفا  تکرار رمز عبور را وارد نمایید!'
                    },
                    minLength: {
                      value: 9,
                      message: ' حداقل رمز عبور 9 کاراکتر است'
                    }
                  })}
                />
              </InputGroup>
              <FormErrorMessage>
                {errors.rePassword && errors.rePassword.message}
              </FormErrorMessage>
            </FormControl>
            <Multiselect
              options={roles}
              displayValue="name"
              selectedValues={selectedRoles}
              onSelect={onSelect}
              onRemove={onRemove}
            />
          </Stack>
          <Button
            borderRadius={0}
            isLoading={isSubmitting}
            type="submit"
            variant="solid"
            colorScheme="teal"
            width="full"
            mt={5}
          >
            ذخیره اطلاعات
          </Button>
        </form>
      </Box>
    </Center>
  )
}
