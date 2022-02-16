import React, { useEffect, useReducer } from 'react'
import axios from 'axios'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
const AdminLayout = dynamic(() => import('../../../components/layouts/admin'))
import { getError } from '../../../utils/error'
import Cookies from 'js-cookie'
import {
  Button,
  ButtonGroup,
  Center,
  CircularProgress,
  Box,
  List,
  ListItem,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
  Container
} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { BiEdit } from 'react-icons/bi'
import { RiDeleteBin2Line } from 'react-icons/ri'

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' }
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        categories: action.payload,
        error: ''
      }
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true }
    case 'DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true }
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false }
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false }
    default:
      state
  }
}

function AdminCategories() {
  const router = useRouter()

  const userId = Cookies.get('userId')

  const token = Cookies.get('userToken')

  const toast = useToast()

  const [{ loading, categories, successDelete, loadingDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      categories: [],
      error: ''
    })

  /* eslint-disable react-hooks/exhaustive-deps */

  useEffect(() => {
    if (userId === undefined) {
      return router.push('/login')
    }
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' })
        const { data } = await axios.get(`/api/admin/category/all`, {
          headers: { authorization: `Bearer ${token}` }
        })
        dispatch({ type: 'FETCH_SUCCESS', payload: data })
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) })
        toast({
          title: getError(err),
          status: 'error',
          isClosable: true
        })
      }
    }
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' })
    } else {
      fetchData()
    }
  }, [successDelete, userId])

  const deleteHandler = async category_id => {
    if (!window.confirm('آیا شما مطمین هستید؟')) {
      return
    }

    try {
      dispatch({ type: 'DELETE_REQUEST' })
      await axios.delete(`/api/admin/category/${category_id}`, {
        headers: { authorization: `Bearer ${token}` }
      })
      dispatch({ type: 'DELETE_SUCCESS' })

      toast({
        title: 'دسته بندی مورد نظر با موفقیت حذف شد',
        status: 'success',
        isClosable: true
      })
    } catch (err) {
      dispatch({ type: 'DELETE_FAIL' })
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
                w="90%"
                h="auto"
                bg="white"
                borderRadius="2px"
                mt={10}
                mb={20}
              >
                <List>
                  <ListItem>
                    <NextLink href={`/admin/category/insert`} passHref>
                      <Button
                        colorScheme="teal"
                        size="md"
                        rightIcon={<AddIcon />}
                        mb={5}
                      >
                        ایجاد دسته بندی جدید
                      </Button>
                    </NextLink>
                  </ListItem>
                  {loadingDelete && <CircularProgress />}

                  <ListItem>
                    {loading ? (
                      <CircularProgress />
                    ) : (
                      <Table>
                        <Thead>
                          <Tr>
                            <Th>ID</Th>
                            <Th>نام دسته بندی</Th>
                            <Th>نام والد</Th>
                            <Th>عملیات</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {categories.map(category => (
                            <Tr key={category._id}>
                              <Td>{category._id.substring(20, 24)}</Td>
                              <Td>{category.name}</Td>
                              <Td>
                                {category.parrent_id
                                  ? category.parrent_id.name
                                  : 'دسته اصلی'}
                              </Td>

                              <Td>
                                <ButtonGroup variant="outline" spacing="6">
                                  <NextLink
                                    href={`/admin/category/${category._id}`}
                                    passHref
                                  >
                                    <Button
                                      border="2px"
                                      borderColor="green.500"
                                    >
                                      <BiEdit />
                                    </Button>
                                  </NextLink>
                                  <Button
                                    onClick={() => deleteHandler(category._id)}
                                    border="2px"
                                    borderColor="red.500"
                                  >
                                    <RiDeleteBin2Line />
                                  </Button>
                                </ButtonGroup>
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    )}
                  </ListItem>
                </List>
              </Box>
            </Center>
          </Box>
        </Box>
      </Container>
    </AdminLayout>
  )
}

export default dynamic(() => Promise.resolve(AdminCategories), { ssr: false })
