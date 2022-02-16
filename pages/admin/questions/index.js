import React, { useEffect, useState } from 'react'

import dynamic from 'next/dynamic'

import {
  Button,
  Box,
  Container,
  Flex,
  Spinner,
  useToast
} from '@chakra-ui/react'
import { FiTrello, FiThumbsUp, FiThumbsDown } from 'react-icons/fi'

import { AiFillEdit, AiFillDelete } from 'react-icons/ai'
// import AdminLayout from '../../../components/layouts/admin'
const AdminLayout = dynamic(() => import('../../../components/layouts/admin'))
import moment from 'jalali-moment'

import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import axios from 'axios'
import { getError } from '../../../utils/error'

const AdminQuestions = dynamic(() =>
  import('../../../components/admin/questions/AdminQuestions')
)
function ExpandableQuestionTable() {
  const router = useRouter()

  const userId = Cookies.get('userId')

  const token = Cookies.get('userToken')

  const toast = useToast()

  const [questions, setQuestions] = useState([])

  const [loading, setLoading] = useState(false)

  async function changeQuestionStatus(id, status) {
    try {
      const { data } = await axios.put(
        `/api/admin/question/status/${id}`,
        {
          status: !status
        },
        {
          headers: { authorization: `Bearer ${token}` }
        }
      )

      toast({
        title: 'وضعیت حکم مورد نظر با موفقیت تغییر کرد',
        status: 'success',
        isClosable: true
      })
      questionsHandler(data)
    } catch (err) {
      toast({
        title: getError(err),
        status: 'error',
        isClosable: true
      })
    }
  }

  /* eslint-disable react-hooks/exhaustive-deps */

  useEffect(() => {
    if (!userId) {
      router.push('/login')
    }
    const fetchData = async () => {
      setLoading(true)
      try {
        const { data } = await axios.get(`/api/admin/question/all`, {
          headers: { authorization: `Bearer ${token}` }
        })
        data.map((item, i) =>
          setQuestions(prev => [
            ...prev,
            {
              Id: i,
              question: item.text,
              category: item.catId.name,
              created_at: moment(item.createdAt, 'YYYY-M-D HH:mm:ss')
                .locale('fa')
                .format('YYYY-M-D HH:mm:ss'),
              count_visits: item.s_count,
              count_comments: item.c_count,
              user_created_name:
                item.userId !== null ? item.userId.nameFamily : 'حذف شده',
              subRows: [
                {
                  Id: '',
                  question: '',
                  category: (
                    <Button
                      colorScheme="teal"
                      variant="outline"
                      onClick={() =>
                        router.push(`/admin/questions/answer/${item._id}`)
                      }
                      rightIcon={<FiTrello />}
                    >
                      نمایش جواب
                    </Button>
                  ),
                  created_at: (
                    <Button
                      colorScheme="teal"
                      variant="outline"
                      onClick={() =>
                        router.push(`/admin/questions/${item._id}`)
                      }
                      rightIcon={<AiFillEdit />}
                    >
                      ویرایش اطلاعات{' '}
                    </Button>
                  ),
                  count_visits: (
                    <Button
                      variant="outline"
                      colorScheme={item.status === true ? 'pink' : 'telegram'}
                      onClick={() =>
                        changeQuestionStatus(item._id, item.status)
                      }
                      rightIcon={
                        item.status === true ? <FiThumbsUp /> : <FiThumbsDown />
                      }
                    >
                      {item.status === true ? ' تایید؟' : 'عدم تایید؟'}
                    </Button>
                  ),
                  count_comments: (
                    <Button
                      colorScheme="red"
                      variant="outline"
                      onClick={() => deleteHandler(item._id)}
                      rightIcon={<AiFillDelete />}
                    >
                      حذف سوال
                    </Button>
                  )
                }
              ]
            }
          ])
        )

        setLoading(false)
      } catch (err) {
        setLoading(false)

        toast({
          title: getError(err),
          status: 'error',
          isClosable: true
        })
      }
    }
    fetchData()
  }, [userId])

  function questionsHandler(data) {
    setQuestions([])
    setLoading(true)
    data.map((item, i) =>
      setQuestions(prev => [
        ...prev,
        {
          Id: i,
          question: item.text,
          category: item.catId.name,
          created_at: moment(item.createdAt, 'YYYY-M-D HH:mm:ss')
            .locale('fa')
            .format('YYYY-M-D HH:mm:ss'),
          count_visits: item.s_count,
          count_comments: item.c_count,
          user_created_name:
            item.userId !== null ? item.userId.nameFamily : 'حذف شده',
          subRows: [
            {
              Id: '',
              question: '',
              category: (
                <Button
                  colorScheme="teal"
                  variant="outline"
                  onClick={() =>
                    router.push(`/admin/questions/answer/${item._id}`)
                  }
                  rightIcon={<FiTrello />}
                >
                  نمایش جواب
                </Button>
              ),
              created_at: (
                <Button
                  colorScheme="teal"
                  variant="outline"
                  onClick={() => router.push(`/admin/questions/${item._id}`)}
                  rightIcon={<AiFillEdit />}
                >
                  ویرایش اطلاعات{' '}
                </Button>
              ),
              count_visits: (
                <Button
                  variant="outline"
                  colorScheme={item.status === true ? 'pink' : 'telegram'}
                  onClick={() => changeQuestionStatus(item._id, item.status)}
                  rightIcon={
                    item.status === true ? <FiThumbsUp /> : <FiThumbsDown />
                  }
                >
                  {item.status === true ? ' تایید؟' : 'عدم تایید؟'}
                </Button>
              ),
              count_comments: (
                <Button
                  colorScheme="red"
                  variant="outline"
                  onClick={() => deleteHandler(item._id)}
                  rightIcon={<AiFillDelete />}
                >
                  حذف سوال
                </Button>
              )
            }
          ]
        }
      ])
    )
    setLoading(false)
  }
  const deleteHandler = async id => {
    if (!window.confirm('آیا شما مطمین هستید؟')) {
      return
    }
    try {
      const { data } = await axios.delete(`/api/admin/question/${id}`, {
        headers: { authorization: `Bearer ${token}` }
      })

      toast({
        title: 'احکام مورد نظر با موفقیت حذف شد.',
        status: 'success',
        isClosable: true
      })
      questionsHandler(data)
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
        Header: 'احکام',
        columns: [
          {
            Header: 'Id',
            accessor: 'Id'
          },
          {
            Header: 'question',
            accessor: 'question'
          }
        ]
      },
      {
        Header: 'جزییات',
        columns: [
          {
            Header: 'category',
            accessor: 'category'
          },
          {
            Header: 'created_at',
            accessor: 'created_at'
          },
          {
            Header: 'count_visits',
            accessor: 'count_visits'
          },
          {
            Header: 'count_comments',
            accessor: 'count_comments'
          },
          {
            Header: 'user_created_name',
            accessor: 'user_created_name'
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
            <Flex
              h={{ base: 'auto', md: '100vh' }}
              py={[0, 10, 20]}
              direction={{ base: 'column', md: 'row' }}
            >
              {loading && <Spinner />}

              <AdminQuestions columns={columns} data={questions} />
            </Flex>
          </Box>
        </Box>
      </Container>
    </AdminLayout>
  )
}

export default dynamic(() => Promise.resolve(ExpandableQuestionTable), {
  ssr: false
})
