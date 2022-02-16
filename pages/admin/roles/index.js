import axios from 'axios'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import React, { useEffect, useReducer } from 'react'
// import { CircularProgress, List, ListItem, Typography } from '@material-ui/core'
import { getError } from '../../../utils/error'
// import useStyles from '../../../utils/style'
import Cookies from 'js-cookie'
const AdminLayout = dynamic(() => import('../../../components/layouts/admin'))
import {
  Button,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  ButtonGroup,
  useToast,
  Container,
  Box,
  List,
  ListItem,
  CircularProgress
} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { BiEditAlt } from 'react-icons/bi'
import { RiDeleteBin5Line } from 'react-icons/ri'

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' }
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        roles: action.payload,
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

function AdminRoles() {
  const router = useRouter()
  const classes = useStyles()

  const userId = Cookies.get('userId')
  const token = Cookies.get('userToken')

  const toast = useToast()

  const [{ loading, error, roles, successDelete, loadingDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      roles: [],
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
        const { data } = await axios.get(`/api/admin/role`, {
          headers: { authorization: `Bearer ${token}` }
        })
        dispatch({ type: 'FETCH_SUCCESS', payload: data })
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) })
      }
    }
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' })
    } else {
      fetchData()
    }
  }, [successDelete, userId])

  const deleteHandler = async id => {
    if (!window.confirm('آیا شما مطمین هستید؟')) {
      return
    }

    try {
      dispatch({ type: 'DELETE_REQUEST' })
      await axios.delete(`/api/admin/role/${id}`, {
        headers: { authorization: `Bearer ${token}` }
      })
      dispatch({ type: 'DELETE_SUCCESS' })

      toast({
        title: 'نقش با موفقیت حذف شد.',
        status: 'success',
        isClosable: true
      })
    } catch (err) {
      dispatch({ type: 'DELETE_FAIL' })
      toast({
        title: getError(err),
        status: 'success',
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
            <List>
              <ListItem>
                <NextLink href={`/admin/roles/insert`} passHref>
                  <Button colorScheme="teal" size="lg" rightIcon={<AddIcon />}>
                    ایجاد نقش جدید
                  </Button>
                </NextLink>
              </ListItem>
              {loadingDelete && <CircularProgress />}

              <ListItem>
                {loading ? (
                  <CircularProgress />
                ) : error ? (
                  <typography className={classes.error}>{error}</typography>
                ) : (
                  <Table>
                    <Thead>
                      <Tr>
                        <Th>ID</Th>
                        <Th>نام نقش</Th>

                        <Th>عملیات</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {roles.map(role => (
                        <Tr key={role._id}>
                          <Td>{role._id.substring(20, 24)}</Td>
                          <Td>{role.name}</Td>

                          <Td>
                            <ButtonGroup variant="outline" spacing="6">
                              <NextLink
                                href={`/admin/roles/${role._id}`}
                                passHref
                              >
                                <Button
                                  size="md"
                                  height="48px"
                                  width="100px"
                                  border="2px"
                                  borderColor="green.500"
                                  rightIcon={<BiEditAlt />}
                                >
                                  ویرایش
                                </Button>
                              </NextLink>
                              <Button
                                onClick={() => deleteHandler(role._id)}
                                size="md"
                                height="48px"
                                width="100px"
                                border="2px"
                                borderColor="red.500"
                                rightIcon={<RiDeleteBin5Line />}
                              >
                                حذف
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
        </Box>
      </Container>
    </AdminLayout>
  )
}

export default dynamic(() => Promise.resolve(AdminRoles), { ssr: false })
