import React, { useContext, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'

// import Layout from '../components/layouts/article'
const Layout = dynamic(() => import('../components/layouts/article'))
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  chakra,
  Box,
  Link,
  FormControl,
  FormErrorMessage,
  InputRightElement,
  Center,
  Image,
  useToast
} from '@chakra-ui/react'
import { FaLock } from 'react-icons/fa'
import { useState } from 'react'
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai'
import { MdAlternateEmail, MdPhoneIphone } from 'react-icons/md'
import axios from 'axios'

import LayoutContext from '../utils/Store'
import { getError } from '../utils/error'
import Cookies from 'js-cookie'

const CFaLock = chakra(FaLock)

const RegisterScreen = () => {
  const router = useRouter()
  const { redirect } = router.query
  const token = Cookies.get('userToken')

  const toast = useToast()

  /* eslint-disable react-hooks/exhaustive-deps */

  useEffect(() => {
    if (token) {
      router.push(redirect || '/')
      return
    }
  }, [token])
  const ctx = useContext(LayoutContext)

  const [showPassword, setShowPassword] = useState(false)

  const handleShowClick = () => setShowPassword(!showPassword)

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm()

  const onSubmit = async values => {
    if (values.password !== values.rePassword) {
      toast({
        title: 'لطفا رمز عبور و تکرار رمز عبور را به درستی وارد نمایید',
        status: 'error',
        isClosable: true
      })

      return
    }
    try {
      const { data } = await axios.post('/api/auth/register', {
        password: values.password,
        email: values.email,
        mobile: values.mobile
      })

      ctx.setUserInfo(data)

      toast({
        title: 'کاربر گرامی! عضویت شما در سایت با موفقیت انجام گردید.',
        status: 'success',
        isClosable: true
      })

      router.push(redirect || '/')
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
    <Layout title="register">
      <Flex
        flexDirection="column"
        backgroundColor="#e6b8a2"
        justifyContent="center"
        alignItems="center"
      >
        <Stack
          flexDir="column"
          mb="2"
          mt="2"
          justifyContent="center"
          alignItems="center"
        >
          <Heading as="h4" size="md" color="teal.400">
            عضویت در سایت زمزم احکام
          </Heading>
          <Center my={6}>
            <Image src="/images/works/amembo_icon.png" alt="icon" />
          </Center>

          <Box minW={{ base: '90%', md: '468px' }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack
                spacing={4}
                p="1rem"
                backgroundColor="whiteAlpha.900"
                boxShadow="md"
              >
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
                          message:
                            'لطفا شماره تلفن همراه را به درستی وارد نمایید'
                        }
                      })}
                    />
                  </InputGroup>
                  <FormErrorMessage>
                    {errors.mobile && errors.mobile.message}
                  </FormErrorMessage>
                </FormControl>
                {/* password input */}
                <FormControl isRequired isInvalid={errors.password}>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.300">
                      <CFaLock color="gray.300" />
                    </InputLeftElement>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      placeholder="رمز عبور"
                      {...register('password', {
                        required: {
                          value: true,
                          message: 'لطفا رمز عبور را وارد نمایید!'
                        },
                        minLength: {
                          value: 9,
                          message: ' حداقل رمز عبور 9 کاراکتر است'
                        }
                      })}
                    />
                    <InputRightElement width="4.5rem">
                      <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                        {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  {/* <FormHelperText textAlign="right">
                    <Link>forgot password?</Link>
                  </FormHelperText> */}
                  <FormErrorMessage>
                    {errors.password && errors.password.message}
                  </FormErrorMessage>
                </FormControl>
                {/* rePassword input */}
                <FormControl isRequired isInvalid={errors.rePassword}>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.300">
                      <CFaLock color="gray.300" />
                    </InputLeftElement>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="تکرار رمز عبور"
                      id="rePassword"
                      name="rePassword"
                      {...register('rePassword', {
                        required: {
                          value: true,
                          message: 'لطفا رمز عبور را وارد نمایید!'
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
                <Button
                  borderRadius={0}
                  isLoading={isSubmitting}
                  type="submit"
                  variant="solid"
                  colorScheme="teal"
                  width="full"
                >
                  ورود به سایت
                </Button>
              </Stack>
            </form>
          </Box>
        </Stack>
        <Box>
          آیا در سایت عضویت دارید؟
          <Link color="teal.500" href="/login">
            ورود به سایت
          </Link>
        </Box>
      </Flex>
    </Layout>
  )
}

export default RegisterScreen
