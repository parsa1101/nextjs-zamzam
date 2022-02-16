import styled from '@emotion/styled'
import dynamic from 'next/dynamic'

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Flex,
  Spinner,
  useDisclosure,
  useToast,
  IconButton,
  Text,
  Tooltip,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Container,
  Box,
  Input
} from '@chakra-ui/react'
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  ArrowForwardIcon
} from '@chakra-ui/icons'
// import AdminLayout from '../../../components/layouts/admin'
const AdminLayout = dynamic(() => import('../../../components/layouts/admin'))
import {
  useTable,
  useExpanded,
  usePagination,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce
} from 'react-table'
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import axios from 'axios'
import { getError } from '../../../utils/error'
// import ShowUserInfoModal from '../../../components/admin/modal/ShowInfo/ShowUserInfo'
const ShowUserInfoModal = dynamic(() =>
  import('../../../components/admin/modal/ShowInfo/ShowUserInfo')
)

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 1px;
        }
      }
    }

    th {
      position: sticky;
      top: 1;
      z-index: 1;
    }
    ,
    td {
      margin: 0;
      padding: 0.9rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;
    }
  }
`
// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter
}) {
  const count = preGlobalFilteredRows.length
  const [value, setValue] = React.useState(globalFilter)
  const onChange = useAsyncDebounce(value => {
    setGlobalFilter(value || undefined)
  }, 200)

  return (
    <span>
      جستجو:{' '}
      <Input
        value={value || ''}
        size="lg"
        onChange={e => {
          setValue(e.target.value)
          onChange(e.target.value)
        }}
        placeholder={` تعداد سطرها...${count}`}
      />
    </span>
  )
}

function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter }
}) {
  const count = preFilteredRows.length

  return (
    <input
      className="form-control"
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined)
      }}
      placeholder={`Search ${count} records...`}
    />
  )
}

function AdminUsers({ columns: userColumns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,

    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { pageIndex, pageSize }
  } = useTable(
    {
      columns: userColumns,
      data,
      initialState: { pageIndex: 0, pageSize: 5 },
      defaultColumn
    },

    useFilters,
    useGlobalFilter,
    useExpanded,
    usePagination
  )

  const defaultColumn = React.useMemo(
    () => ({
      // Default Filter UI
      Filter: DefaultColumnFilter
    }),
    []
  )
  return (
    <>
      <Flex flexDir="column" overflow="auto">
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={state.globalFilter}
          setGlobalFilter={setGlobalFilter}
        />

        <Styles>
          <Table {...getTableProps()}>
            <Thead>
              {headerGroups.map((headerGroup, i) => (
                <Tr key={i} {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column, index) => (
                    <Th key={index} {...column.getHeaderProps()}>
                      {column.render('Header')}
                    </Th>
                  ))}
                </Tr>
              ))}
            </Thead>
            <Tbody {...getTableBodyProps()}>
              {page.map((row, i) => {
                prepareRow(row)
                return (
                  <Tr key={i} {...row.getRowProps()}>
                    {row.cells.map((cell, j) => {
                      return (
                        <Td align="center" key={j} {...cell.getCellProps()}>
                          {cell.render('Cell')}
                        </Td>
                      )
                    })}
                  </Tr>
                )
              })}
            </Tbody>
          </Table>
        </Styles>
        <Flex justifyContent="space-between" m={4} alignItems="center">
          <Flex>
            <Tooltip label="First Page">
              <IconButton
                onClick={() => gotoPage(0)}
                isDisabled={!canPreviousPage}
                icon={<ArrowLeftIcon h={3} w={3} />}
                mr={4}
              />
            </Tooltip>
            <Tooltip label="Previous Page">
              <IconButton
                onClick={previousPage}
                isDisabled={!canPreviousPage}
                icon={<ChevronLeftIcon h={6} w={6} />}
              />
            </Tooltip>
          </Flex>

          <Flex alignItems="center">
            <Text flexShrink="0" mr={8}>
              Page{' '}
              <Text fontWeight="bold" as="span">
                {pageIndex + 1}
              </Text>{' '}
              of{' '}
              <Text fontWeight="bold" as="span">
                {pageOptions.length}
              </Text>
            </Text>
            <Text flexShrink="0">Go to page:</Text>{' '}
            <NumberInput
              ml={2}
              mr={8}
              w={28}
              min={1}
              max={pageOptions.length}
              onChange={value => {
                const page = value ? value - 1 : 0
                gotoPage(page)
              }}
              defaultValue={pageIndex + 1}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Select
              w={32}
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value))
              }}
            >
              {[10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </Select>
          </Flex>

          <Flex>
            <Tooltip label="Next Page">
              <IconButton
                onClick={nextPage}
                isDisabled={!canNextPage}
                icon={<ChevronRightIcon h={6} w={6} />}
              />
            </Tooltip>
            <Tooltip label="Last Page">
              <IconButton
                onClick={() => gotoPage(pageCount - 1)}
                isDisabled={!canNextPage}
                icon={<ArrowRightIcon h={3} w={3} />}
                ml={4}
              />
            </Tooltip>
          </Flex>
        </Flex>
      </Flex>
    </>
  )
}

function ExpandableTableComponent() {
  const router = useRouter()

  const userId = Cookies.get('userId')

  const token = Cookies.get('userToken')

  const toast = useToast()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const [users, setUsers] = useState([])

  const [loading, setLoading] = useState(false)

  const [showUserInfoModal, changeShowUserInfoModal] = useState(false)

  const [user_id, setUser_id] = useState('')

  function showInfoModalHandler(id) {
    onOpen()
    setUser_id(id)
    changeShowUserInfoModal(!showUserInfoModal)
  }

  /* eslint-disable react-hooks/exhaustive-deps */

  useEffect(() => {
    if (!userId) {
      return router.push('/login')
    }
    const fetchData = async () => {
      setLoading(true)
      try {
        const { data } = await axios.get(`/api/admin/users`, {
          headers: { authorization: `Bearer ${token}` }
        })
        data.map(item =>
          setUsers(prev => [
            ...prev,
            {
              nameFamily: item.nameFamily ? item.nameFamily : 'ثبت نشده',
              email: item.email,
              mobile: item.mobile,
              role: item.roles.map((value, i) => (
                <Text key={i} as="mark">
                  {value}
                  <br />
                </Text>
              )),
              subRows: [
                {
                  nameFamily: (
                    <Button onClick={() => showInfoModalHandler(item._id)}>
                      نمایش اطلاعات{' '}
                    </Button>
                  ),
                  email: (
                    <Button
                      onClick={() => router.push(`/admin/users/${item._id}`)}
                    >
                      ویرایش اطلاعات{' '}
                    </Button>
                  ),
                  mobile: (
                    <Button onClick={() => deleteHandler(item._id)}>
                      حذف کاربر
                    </Button>
                  ),
                  role: (
                    <Button
                      colorScheme={item.status === '1' ? 'teal' : 'orange'}
                      onClick={() => changeUserStatus(item._id, item.status)}
                    >
                      {item.status === '1' ? 'عدم تایید؟' : 'تایید؟'}
                    </Button>
                  )
                }
              ]
            }
          ])
        )
        setLoading(false)
      } catch (err) {
        toast({
          title: getError(err),
          status: 'error',
          isClosable: true
        })
      }
    }
    fetchData()
  }, [])

  function usersHandler(usersValue) {
    setUsers([])

    usersValue.map(item =>
      setUsers(prev => [
        ...prev,
        {
          nameFamily: item.nameFamily ? item.nameFamily : 'ثبت نشده',
          email: item.email,
          mobile: item.mobile,
          role: item.isAdmin ? 'ادمین' : '',
          subRows: [
            {
              nameFamily: (
                <Button onClick={() => showInfoModalHandler(item._id)}>
                  نمایش اطلاعات{' '}
                </Button>
              ),
              email: (
                <Button onClick={() => router.push(`/admin/users/${item._id}`)}>
                  ویرایش اطلاعات{' '}
                </Button>
              ),
              mobile: (
                <Button onClick={() => deleteHandler(item._id)}>
                  حذف کاربر
                </Button>
              ),
              role: (
                <Button
                  colorScheme={item.status === '1' ? 'teal' : 'orange'}
                  onClick={() => changeUserStatus(item._id, item.status)}
                >
                  {item.status === '1' ? 'عدم تایید؟' : 'تایید؟'}
                </Button>
              )
            }
          ]
        }
      ])
    )
  }
  const deleteHandler = async id => {
    if (!window.confirm('آیا شما مطمین هستید؟')) {
      return
    }
    try {
      const { data } = await axios.delete(`/api/admin/users/${id}`, {
        headers: { authorization: `Bearer ${token}` }
      })

      toast({
        title: 'کاربر مورد نظر با موفقیت حذف شد.',
        status: 'success',
        isClosable: true
      })
      usersHandler(data)
    } catch (err) {
      toast({
        title: getError(err),
        status: 'error',
        isClosable: true
      })
    }
  }

  const changeUserStatus = async (id, status) => {
    try {
      const { data } = await axios.put(
        `/api/admin/users/changeStatus/${id}`,
        {
          status: status
        },
        {
          headers: { authorization: `Bearer ${token}` }
        }
      )
      toast({
        title: 'وضعیت کاربر با موفقیت تغییر کرد.',
        status: 'success',
        isClosable: true
      })

      usersHandler(data)
    } catch (err) {
      toast({
        title: getError(err),
        status: 'error',
        isClosable: true
      })
    }
  }

  const columns = React.useMemo(
    () => [
      {
        id: 'expander', // Make sure it has an ID
        Header: ({ getToggleAllRowsExpandedProps, isAllRowsExpanded }) => (
          <span {...getToggleAllRowsExpandedProps()}>
            {isAllRowsExpanded ? '👇' : '👉'}
          </span>
        ),
        Cell: ({ row }) =>
          row.canExpand ? (
            <span
              {...row.getToggleRowExpandedProps({
                style: {
                  paddingLeft: `${row.depth * 2}rem`
                }
              })}
            >
              {row.isExpanded ? '👇' : '👉'}
            </span>
          ) : null
      },
      {
        Header: 'اطلاعات',
        columns: [
          {
            Header: 'nameFamily',
            accessor: 'nameFamily'
          }
        ]
      },
      {
        Header: 'کاربر',
        columns: [
          {
            Header: 'email',
            accessor: 'email'
          },
          {
            Header: 'mobile',
            accessor: 'mobile'
          },
          {
            Header: 'role',
            accessor: 'role'
          }
        ]
      }
    ],
    []
  )

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
            {/* <Heading as="h4" size="md">
              نمایش کاربران :
            </Heading> */}
            <Button
              rightIcon={<ArrowForwardIcon />}
              colorScheme="teal"
              variant="outline"
              onClick={() => router.push('/admin/users/insert')}
              mt="50"
              mb="5"
              ml="50"
            >
              ثبت کاربر جدید
            </Button>
            <Flex
              h={{ base: 'auto', md: '100vh' }}
              py={[0, 10, 20]}
              direction={{ base: 'column', md: 'row' }}
              ml="10"
            >
              {loading && <Spinner />}

              {showUserInfoModal && (
                <ShowUserInfoModal
                  onClose={onClose}
                  isOpen={isOpen}
                  id={user_id}
                />
              )}
              <AdminUsers columns={columns} data={users} />
            </Flex>
          </Box>
        </Box>
      </Container>
    </AdminLayout>
  )
}

// export default ExpandableTableComponent
export default dynamic(() => Promise.resolve(ExpandableTableComponent), {
  ssr: false
})
