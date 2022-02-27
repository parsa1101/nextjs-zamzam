import React, { useState } from 'react'

import { useRouter } from 'next/router'

import axios from 'axios'

import db from '../../../utils/db'

import User from '../../../models/user'

import useSWR from 'swr'

import dynamic from 'next/dynamic'

import {
  Button,
  Flex,
  Spinner,
  useDisclosure,
  useToast,
  Text,
  Container,
  Box,
  Center
} from '@chakra-ui/react'

import { ArrowForwardIcon } from '@chakra-ui/icons'

const AdminLayout = dynamic(() => import('../../../components/layouts/admin'))

const AdminUsers = dynamic(() => import('../../../components/users/AdminUsers'))
const ShowUserInfoModal = dynamic(() =>
  import('../../../components/admin/modal/ShowInfo/ShowUserInfo')
)

function ExpandableTableComponent({ token }) {
  const router = useRouter()

  const toast = useToast()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const [users, setUsers] = useState([])

  const [loading, setLoading] = useState(false)

  const [showUserInfoModal, changeShowUserInfoModal] = useState(false)

  const [user_id, setUser_id] = useState('')

  async function showInfoModalHandler(id) {
    try {
      const { data } = await axios.get(`/api/admin/users/countUserInfo/${id}`, {
        headers: { Authorization: 'Bearer ' + token }
      })

      if (data) {
        onOpen()
        setUser_id(id)
        changeShowUserInfoModal(!showUserInfoModal)
      } else {
        toast({
          description: 'متاسفانه اطلاعاتی ثبت نشده است!',
          status: 'error',
          duration: 9000
        })
      }
    } catch (err) {
      toast({
        title: 'خطا',
        description: err.message,
        status: 'error',
        duration: 9000
      })
    }
  }

  const fetcher = async (url, token) => {
    setLoading(true)
    await axios
      .get(url, { headers: { Authorization: 'Bearer ' + token } })
      .then(res => {
        res.data.map(item =>
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
      })
    setLoading(false)
  }
  useSWR(users.length === 0 ? [`/api/admin/users`, token] : null, fetcher, {
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      if (error) {
        toast({
          title: 'خطا',
          description: error.message,
          status: 'error',
          duration: 9000
        })
      }
      if (retryCount >= 10) return
      // Retry after 5 seconds.
      setTimeout(() => revalidate({ retryCount }), 5000)
    }
  })

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
        title: err.message,
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
        title: err.message,
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
            <Center mt={5}>{loading && <Spinner />}</Center>
            <Flex
              h={{ base: 'auto', md: '100vh' }}
              py={[0, 10, 20]}
              direction={{ base: 'column', md: 'row' }}
              ml="10"
            >
              {showUserInfoModal && (
                <ShowUserInfoModal
                  onClose={onClose}
                  isOpen={isOpen}
                  id={user_id}
                  token={token}
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

export async function getServerSideProps(context) {
  const userId = context.req.cookies['userId']
  const token = context.req.cookies['userToken']

  await db.connect()
  const user = await User.findById(userId).lean()

  await db.disconnect()

  if (!userId || !user.isAdmin) {
    return {
      redirect: {
        permanent: false,
        destination: '/401'
      },
      props: {}
    }
  }
  return {
    props: {
      token,
      userId
    }
  }
}

export default ExpandableTableComponent

// export default dynamic(() => Promise.resolve(ExpandableTableComponent), {
//   ssr: false
// })
