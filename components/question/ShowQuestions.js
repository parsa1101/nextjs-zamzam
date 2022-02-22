import axios from 'axios'

import Cookies from 'js-cookie'

import dynamic from 'next/dynamic'

import React, {
  Fragment,
  useContext,
  useEffect,
  useReducer,
  useState
} from 'react'
import {} from '../../utils/error'

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Button,
  useDisclosure,
  Modal,
  ModalContent,
  ModalOverlay,
  ModalFooter,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useToast
} from '@chakra-ui/react'
import LayoutContext from '../../utils/Store'
import { IoIosArrowRoundForward } from 'react-icons/io'
// import ShowModal from './ShowModal'
const ShowModal = dynamic(() => import('./ShowModal'))

import { useRouter } from 'next/router'

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true }
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, questions: action.payload }
    case 'FETCH_FAIL':
      return { ...state, loading: false }

    default:
      return state
  }
}
export default function ShowQuestions() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const router = useRouter()

  const token = Cookies.get('userToken')
  const userId = Cookies.get('userId')

  const [modalId, setModalId] = useState('')

  const [isExpert, setIsExpert] = useState(false)

  const ctx = useContext(LayoutContext)

  const catId = ctx.catId

  const toast = useToast()

  const [{ questions, loading }, dispatch] = useReducer(reducer, {
    loading: false,
    questions: []
  })

  /* eslint-disable react-hooks/exhaustive-deps */

  useEffect(() => {
    dispatch({ type: 'FETCH_REQUEST' })
    async function getQuestions() {
      try {
        const { data } = await axios.get(
          `/api/questions/temporary/cat/${catId}`,
          {
            headers: { authorization: `Bearer ${token}` }
          }
        )

        dispatch({ type: 'FETCH_SUCCESS', payload: data })
        if (data.length === 0) {
          toast({
            title: 'متاسفانه سوالی مطرح نشده است',
            status: 'error',
            isClosable: true
          })
        }
      } catch (err) {
        toast({
          title: err.message,
          status: 'error',
          isClosable: true
        })
      }
    }
    async function getRandomQuestions() {
      try {
        const { data } = await axios.get(`/api/questions/temporary`, {
          headers: { authorization: `Bearer ${token}` }
        })

        dispatch({ type: 'FETCH_SUCCESS', payload: data })
        if (data.length === 0) {
          toast({
            title: 'متاسفانه سوالی مطرح نشده است',
            status: 'error',
            isClosable: true
          })
        }
      } catch (err) {
        toast({
          title: err.message,
          status: 'error',
          isClosable: true
        })
      }
    }
    if (catId) {
      getQuestions()
    } else {
      getRandomQuestions()
    }
  }, [catId])

  useEffect(() => {
    async function getUserExpert() {
      try {
        const { data } = await axios.get(`/api/user/role/${userId}`, {
          headers: { authorization: `Bearer ${token}` }
        })
        setIsExpert(data)
      } catch (err) {
        toast({
          title: err.message,
          status: 'error',
          isClosable: true
        })
      }
    }
    getUserExpert()
  }, [userId])

  function clickHandler(id) {
    if (isExpert) {
      ctx.setUploadInfo('', '')
      setModalId(id)
      onOpen()
    } else {
      return router.push('/401')
    }
  }
  return (
    <Fragment>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>شماره</Th>
            <Th>متن سوال</Th>

            <Th>
              {catId && loading && (
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="blue.500"
                  size="xl"
                />
              )}
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {questions.map((question, index) => (
            <Tr key={index}>
              <Td>{index + 1}</Td>
              <Td>{question.full_text}</Td>
              <Td>
                <Button
                  mb={5}
                  rightIcon={<IoIosArrowRoundForward />}
                  colorScheme="blue"
                  variant="outline"
                  onClick={() => clickHandler(question._id)}
                >
                  ثبت جواب
                </Button>
                {modalId === question._id && (
                  <Modal isOpen={isOpen} onClose={onClose} size="lg">
                    <ModalOverlay />
                    <ModalContent>
                      <ModalHeader>ثبت جواب</ModalHeader>
                      <ModalCloseButton />
                      <ModalBody>
                        <ShowModal id={question._id} />
                      </ModalBody>
                      <ModalFooter>
                        <Button colorScheme="red" mr={3} onClick={onClose}>
                          انصراف
                        </Button>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Fragment>
  )
}
