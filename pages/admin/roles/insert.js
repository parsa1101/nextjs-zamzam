import React, { useEffect, useReducer, useState } from 'react'
import dynamic from 'next/dynamic'

import axios from 'axios'
import { useRouter } from 'next/router'

import { useForm } from 'react-hook-form'
import styled from '@emotion/styled'

import Cookies from 'js-cookie'
import { getError } from '../../../utils/error'
const AdminLayout = dynamic(() => import('../../../components/layouts/admin'))
import {
  Box,
  Button,
  Center,
  CircularProgress,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  Input,
  List,
  ListIcon,
  ListItem,
  Text,
  Tooltip,
  useToast,
  Container
} from '@chakra-ui/react'
import { AiFillDelete } from 'react-icons/ai'

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' }
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, error: '' }
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }

    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true }
    case 'DELETE_SUCCESS':
      return { ...state, loadingDelete: false }
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false }

    default:
      state
  }
}

function InsertRole() {
  const userId = Cookies.get('userId')
  const token = Cookies.get('userToken')

  const router = useRouter()

  const toast = useToast()

  const {
    handleSubmit,
    register,

    formState: { errors, isSubmitting }
  } = useForm()

  // const [name, setName] = useState('')

  // const [permision, setPermission] = useState('')

  const [permissionArray, setPermissionArray] = useState([])
  const [roleId, setRoleId] = useState('')

  const [{ loading, loadingDelete }, dispatch] = useReducer(reducer, {
    loading: false,
    error: ''
  })

  /* eslint-disable react-hooks/exhaustive-deps */

  useEffect(() => {
    if (userId === undefined) {
      return router.push('/login')
    }
  }, [userId])

  const ShowForm = styled.form`
  width: '100%',
  maxWidth: 800,
  margin: '0 auto',
  direction: 'rtl',
  `

  const submitHandler = async ({ name, permission }) => {
    if (userId === undefined) {
      return router.push('/login')
    }

    try {
      dispatch({ type: 'FETCH_REQUEST' })

      const { data } = await axios.post(
        `/api/admin/role/insert`,
        {
          _id: roleId,
          name: name,
          permissions: [permission]
        },
        { headers: { authorization: `Bearer ${token}` } }
      )

      toast({
        title: 'اطلاعات با موفقیت ثبت شد',
        status: 'success',
        isClosable: true
      })
      setPermissionArray(data.permissions)
      setRoleId(data._id)
      dispatch({ type: 'FETCH_SUCCESS' })
    } catch (err) {
      dispatch({ type: 'FETCH_FAIL', payload: getError(err) })

      toast({
        title: getError(err),
        status: 'error',
        isClosable: true
      })
    }
  }

  const deleteHandler = async item => {
    if (userId === undefined) {
      return router.push('/login')
    }

    try {
      dispatch({ type: 'DELETE_REQUEST' })
      console.log(roleId)
      const { data } = await axios.delete(
        `/api/admin/role/permission/${roleId}/${item}`,

        { headers: { authorization: `Bearer ${token}` } }
      )

      toast({
        title: 'مجوز دسترسی با موفقیت حذف شد',
        status: 'success',
        isClosable: true
      })
      setPermissionArray(data.permissions)
      setRoleId(data._id)
      dispatch({ type: 'DELETE_SUCCESS' })
    } catch (err) {
      dispatch({ type: 'DELETE_FAIL', payload: getError(err) })
      toast({
        title: getError(err),
        status: 'error',
        isClosable: true
      })
    }
  }
  return (
    <AdminLayout>
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
            <Center>
              <Box
                w="500px"
                h="auto"
                bg="white"
                borderRadius="2px"
                mt={10}
                mb={20}
              >
                <ShowForm onSubmit={handleSubmit(submitHandler)}>
                  <FormControl isInvalid={errors.permission}>
                    <FormLabel htmlFor="name">نام نقش</FormLabel>
                    <Input
                      _placeholder={{ color: '#457b9d' }}
                      // onChange={e => {
                      //   setName(e.target.value)
                      // }}
                      id="name"
                      {...register('name', {
                        required: {
                          value: true,
                          message: 'لطفا نام نقش را وارد نمایید!'
                        },

                        pattern: {
                          value: /^[A-Za-z]+((\s)?([A-Za-z])+)*$/,
                          message: 'لطفا نام نقش را به درستی وارد نمایید'
                        }
                      })}
                    />
                    <FormErrorMessage>
                      {errors.name && errors.name.message}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={errors.permission}>
                    <FormLabel htmlFor="permission">نام مجوز</FormLabel>
                    <Input
                      _placeholder={{ color: '#457b9d' }}
                      // onChange={e => {
                      //   setPermission(e.target.value)
                      // }}
                      id="permission"
                      {...register('permission', {
                        required: {
                          value: true,
                          message: 'لطفا نام مجوز را وارد نمایید!'
                        },

                        pattern: {
                          value: /^[A-Za-z]+((\s)?([A-Za-z])+)*$/,
                          message: 'لطفا نام مجوز را به درستی وارد نمایید'
                        }
                      })}
                    />
                    <FormErrorMessage>
                      {errors.permission && errors.permission.message}
                    </FormErrorMessage>
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
                {loading ? (
                  <CircularProgress />
                ) : (
                  <Grid xs={12} md={6}>
                    <Text mt={10}>مجوز دسترسی ها:</Text>
                    {loadingDelete && <CircularProgress />}

                    <List spacing={3}>
                      {permissionArray.map((item, index) => (
                        <ListItem key={index}>
                          <Tooltip label="حذف مجوز؟" aria-label="A tooltip">
                            <Button
                              onClick={() => {
                                deleteHandler(item)
                              }}
                              variant="ghost"
                            >
                              <ListIcon as={AiFillDelete} color="green.500" />
                            </Button>
                          </Tooltip>

                          {item}
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                )}
              </Box>
            </Center>
          </Box>
        </Box>
      </Container>
    </AdminLayout>
  )
}
export default dynamic(() => Promise.resolve(InsertRole), { ssr: false })
