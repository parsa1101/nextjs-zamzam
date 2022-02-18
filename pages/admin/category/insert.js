import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import axios from 'axios'
import { useRouter } from 'next/router'

import { useForm } from 'react-hook-form'

const AdminLayout = dynamic(() => import('../../../components/layouts/admin'))
import styled from '@emotion/styled'

import Cookies from 'js-cookie'
import { getError } from '../../../utils/error'
import {
  Button,
  Center,
  Box,
  Container,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Select,
  useToast
} from '@chakra-ui/react'

function InsertCategory() {
  const userId = Cookies.get('userId')

  const token = Cookies.get('userToken')

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
  const [categories, setCategories] = useState([])

  /* eslint-disable react-hooks/exhaustive-deps */

  useEffect(() => {
    if (userId === undefined) {
      return router.push('/login')
    }

    async function getCategories() {
      try {
        const { data } = await axios.get(`/api/admin/category/all`, {
          headers: { authorization: `Bearer ${token}` }
        })
        setCategories(data)
      } catch (err) {
        toast({
          title: getError(err),
          status: 'error',
          isClosable: true
        })
      }
    }
    getCategories()
  }, [userId])

  const submitHandler = async ({ name }) => {
    if (userId === undefined) {
      return router.push('/login')
    }
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
            borderRadius="lg"
            borderColor="gray"
            overflow="hidden"
            bg="white"
            alignItems="center"
            justifyContent="space-between"
            m={15}
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
        </Box>
      </Container>
    </AdminLayout>
  )
}
export default dynamic(() => Promise.resolve(InsertCategory), { ssr: false })
