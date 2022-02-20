import dynamic from 'next/dynamic'
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
  FormControl,
  InputRightElement,
  Center,
  Image,
  FormErrorMessage,
  useToast
} from '@chakra-ui/react'
import { FaLock } from 'react-icons/fa'
import { useState } from 'react'
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai'
import { useForm } from 'react-hook-form'

import { MdAlternateEmail, MdPhoneIphone } from 'react-icons/md'
import useSWR from 'swr'
import axios from 'axios'
// import Cookies from 'js-cookie'

const CFaLock = chakra(FaLock)

const MyAccountScreen = ({ userId, userToken }) => {
  // const ctx = useContext(LayoutContext)
  // const token = Cookies.get('userToken')

  // const router = useRouter()

  const toast = useToast()

  const {
    register,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      email: '',
      mobile: ''
    }
  })

  const fetcher = (url, token) =>
    axios
      .get(url, { headers: { Authorization: 'Bearer ' + token } })
      .then(res =>
        reset({
          email: res.data.email,
          mobile: res.data.mobile
        })
      )

  useSWR([`/api/auth/${userId}`, userToken], fetcher, {
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      if (error) {
        toast({
          title: 'خطا',
          description: 'متاسفانه در بازیابی اطلاعات مشکلی به وجود آمده است.',
          status: 'error',
          duration: 9000
        })
      }

      if (retryCount >= 10) return

      // Retry after 5 seconds.
      setTimeout(() => revalidate({ retryCount }), 5000)
    }
  })

  // useEffect(() => {
  //   if (!userId) {
  //     return router.push('/login?redirect=/myAccount')
  //   } else {
  //     getUser()
  //   }
  //   async function getUser() {
  //     try {
  //       const { data } = await axios.post(
  //         `/api/auth/${userId}`,
  //         {
  //           token: '1'
  //         },
  //         {
  //           headers: { authorization: `Bearer ${token}` }
  //         }
  //       )

  //       reset({
  //         email: data.email,
  //         mobile: data.mobile
  //       })
  //     } catch (err) {
  //       toast({
  //         title: getError(err),
  //         status: 'error',
  //         isClosable: true
  //       })
  //     }
  //   }
  // }, [])

  const [showPassword, setShowPassword] = useState(false)

  const handleShowClick = () => setShowPassword(!showPassword)

  // const onSubmit = async ({ email, mobile, password, rePassword }) => {
  //   if (password !== rePassword) {
  //     toast({
  //       title: 'رمز عبور و تکرار آن با هم برابر نیستند!',
  //       status: 'error',
  //       isClosable: true
  //     })
  //     return
  //   }
  //   try {
  //     const { data } = await axios.put(
  //       '/api/auth/updateUser',
  //       {
  //         email,
  //         mobile,
  //         password
  //       },
  //       { headers: { authorization: `Bearer ${token}` } }
  //     )

  //     ctx.setUserInfo(data)
  //     toast({
  //       title: 'اطلاعات وارد شده با موفقیت ثبت شد.',
  //       status: 'success',
  //       isClosable: true
  //     })
  //     router.push('/')
  //   } catch (err) {
  //     toast({
  //       title: getError(err),
  //       status: 'error',
  //       isClosable: true
  //     })
  //     return
  //   }
  // }

  return (
    <Layout title="myAccount">
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
            تغییر اطلاعات کاربری
          </Heading>
          <Center my={6}>
            <Image src="/images/works/amembo_icon.png" alt="icon" />
          </Center>

          <Box minW={{ base: '90%', md: '468px' }}>
            <form>
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
                          message: 'لطفا  ایمیل  را وارد نمایید!'
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
                  ثبت تغییرات
                </Button>
              </Stack>
            </form>
          </Box>
        </Stack>
      </Flex>
    </Layout>
  )
}
export async function getServerSideProps(context) {
  const userId = context.req.cookies['userId']
  const userToken = context.req.cookies['userToken']

  return {
    props: {
      userId,
      userToken
    }
  }
}
export default MyAccountScreen
