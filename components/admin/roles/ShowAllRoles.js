import React, { useReducer } from 'react'
import NextLink from 'next/link'
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
  Box,
  List,
  ListItem,
  Text,
  Spinner
} from '@chakra-ui/react'

import { AddIcon } from '@chakra-ui/icons'
import { BiEditAlt } from 'react-icons/bi'
import { RiDeleteBin5Line } from 'react-icons/ri'
import axios from 'axios'
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
      return { ...state, loadingDelete: false, roles: action.payload }
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false }
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false }
    default:
      state
  }
}
export default function ShowAllRoles({ allRoles, token }) {
  const toast = useToast()

  const [{ error, roles, loadingDelete }, dispatch] = useReducer(reducer, {
    roles: allRoles,
    error: ''
  })

  const deleteHandler = async id => {
    if (!window.confirm('آیا شما مطمین هستید؟')) {
      return
    }

    try {
      dispatch({ type: 'DELETE_REQUEST' })
      const { data } = await axios.delete(`/api/admin/role/${id}`, {
        headers: { authorization: `Bearer ${token}` }
      })
      dispatch({ type: 'DELETE_SUCCESS', payload: data })

      toast({
        title: 'نقش با موفقیت حذف شد.',
        status: 'success',
        isClosable: true
      })
    } catch (err) {
      dispatch({ type: 'DELETE_FAIL' })
      toast({
        title: err.message,
        status: 'success',
        isClosable: true
      })
    }
  }
  return (
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
        {loadingDelete && <Spinner color="green" />}

        <ListItem>
          {error ? (
            <Text>{error}</Text>
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
                        <NextLink href={`/admin/roles/${role._id}`} passHref>
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
  )
}
