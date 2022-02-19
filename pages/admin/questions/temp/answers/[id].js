import React, { useEffect } from 'react'
import dynamic from 'next/dynamic'

// import AdminLayout from '../../../../../components/layouts/admin'
const AdminLayout = dynamic(() =>
  import('../../../../../components/layouts/admin')
)

import {
  Container,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Flex,
  Heading
} from '@chakra-ui/react'

import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import db from '../../../../../utils/db'
import TemporaryAnswer from '../../../../../models/temporaryAnswer'
import TemporaryQuestion from '../../../../../models/temporaryQuestion'
import { ArrowForwardIcon } from '@chakra-ui/icons'

function EditQuestionScreen({ question, answers }) {
  const userId = Cookies.get('userId')

  const router = useRouter()

  /* eslint-disable react-hooks/exhaustive-deps */

  useEffect(() => {
    if (!userId) {
      return router.push('/login')
    }
  }, [userId])

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
            <Flex flexDir="column">
              <Heading as="h2" size="sm" mt={5}>
                {question.text}
              </Heading>
              <Flex overflow="auto">
                <Table variant="simple" mt={5}>
                  <Thead>
                    <Tr>
                      <Th>شماره</Th>
                      <Th>متن جواب</Th>

                      <Th>نمایش جواب</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {answers.map((item, i) => (
                      <Tr key={i}>
                        <Td>{i}</Td>

                        <Td>{item.text}</Td>
                        <Td>
                          <Button
                            rightIcon={<ArrowForwardIcon />}
                            colorScheme="teal"
                            variant="outline"
                            onClick={() =>
                              router.push(
                                `/admin/questions/temp/answer/${item._id}`
                              )
                            }
                          >
                            نمایش جواب
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Flex>
            </Flex>
          </Box>
        </Box>
      </Container>
    </AdminLayout>
  )
}
// export const getStaticPaths = async () => {
//   await db.connect()

//   const questions = await TemporaryQuestion.find({})
//   await db.disconnect()

//   // generate the paths
//   const paths = questions.map(item => ({
//     params: { id: item._id.toString() }
//   }))

//   return {
//     paths,
//     fallback: true
//   }
// }

export async function getServerSideProps(context) {
  const { params } = context
  const { id } = params

  await db.connect()
  const answers = await TemporaryAnswer.find({ questionId: id }).lean()
  const question = await TemporaryQuestion.findById(id).lean()

  await db.disconnect()
  return {
    props: {
      answers: answers.map(db.convertDocToObjINAnswer),
      question: db.convertDocToObjInTemporaryQuestion(question)
    }
  }
}

export default dynamic(() => Promise.resolve(EditQuestionScreen), {
  ssr: false
})
