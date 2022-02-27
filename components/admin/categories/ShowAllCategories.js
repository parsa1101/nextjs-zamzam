import React, { useReducer } from 'react'
import NextLink from 'next/link'

import {
  Button,
  ButtonGroup,
  CircularProgress,
  ListItem,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast
} from '@chakra-ui/react'

import { BiEdit } from 'react-icons/bi'

import { RiDeleteBin2Line } from 'react-icons/ri'
import axios from 'axios'
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

export default function ShowAllCategories({ token, allCategories }) {
  const toast = useToast()

  const [{ categories, loadingDelete }, dispatch] = useReducer(reducer, {
    categories: allCategories,
    error: ''
  })
  const deleteHandler = async category_id => {
    if (!window.confirm('آیا شما مطمین هستید؟')) {
      return
    }

    try {
      dispatch({ type: 'DELETE_REQUEST' })
      const { data } = await axios.delete(
        `/api/admin/category/${category_id}`,
        {
          headers: { authorization: `Bearer ${token}` }
        }
      )
      dispatch({ type: 'DELETE_SUCCESS' })
      dispatch({ type: 'FETCH_SUCCESS', payload: data })
      toast({
        title: 'دسته بندی مورد نظر با موفقیت حذف شد',
        status: 'success',
        isClosable: true
      })
    } catch (err) {
      dispatch({ type: 'DELETE_FAIL' })
      toast({
        title: err.message,
        status: 'error',
        isClosable: true
      })
    }
  }
  return (
    <div>
      {loadingDelete && <CircularProgress />}

      <ListItem>
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
                  {category.parrent_id ? category.parrent_id.name : 'دسته اصلی'}
                </Td>

                <Td>
                  <ButtonGroup variant="outline" spacing="6">
                    <NextLink href={`/admin/category/${category._id}`} passHref>
                      <Button border="2px" borderColor="green.500">
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
      </ListItem>
    </div>
  )
}
