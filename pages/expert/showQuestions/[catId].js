import React from 'react'

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Container,
  Box,
  useColorModeValue,
  Flex,
  Center,
  Image,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Link,
  Icon,
  Text
} from '@chakra-ui/react'

import db from '../../../utils/db'
import TemporaryQuestion from '../../../models/temporaryQuestion'
import Category from '../../../models/category'

import dynamic from 'next/dynamic'
import { ArrowForwardIcon } from '@chakra-ui/icons'

const Layout = dynamic(() => import('../../../components/layouts/article'))
const Section = dynamic(() => import('../../../components/section'))

export default function ShowQuestions({ tempQuestions, category }) {
  return (
    <Layout title="show-categories">
      <Container>
        <Box
          borderRadius="lg"
          mb={10}
          p={10}
          textAlign="center"
          bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
        >
          نام گروه سوال:{category.name}
        </Box>
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          bg="whiteAlpha.900"
        >
          <Section delay={0.1}>
            <Center my={6}>
              <Image src="/images/works/amembo_icon.png" alt="icon" />
            </Center>
            <Table variant="simple" overflow="auto">
              <Thead>
                <Tr>
                  <Th>شماره</Th>
                  <Th>متن سوال</Th>
                </Tr>
              </Thead>
              <Tbody>
                {tempQuestions.map((question, index) => (
                  <Tr key={index}>
                    <Td>{index + 1}</Td>
                    <Td>
                      <Accordion allowToggle>
                        <AccordionItem>
                          <h2>
                            <AccordionButton>
                              <Box flex="1" textAlign="left">
                                <Text
                                  fontSize={{
                                    base: '10px',
                                    md: '10px',
                                    lg: '15px'
                                  }}
                                >
                                  {question.full_text}
                                </Text>
                              </Box>
                              <AccordionIcon />
                            </AccordionButton>
                          </h2>
                          <AccordionPanel pb={4} bg={'#edede9'}>
                            <Box flex="1" textAlign="center">
                              <Link
                                color="teal.500"
                                isExternal
                                href={`/expert/saveAnswer/${question._id}`}
                              >
                                <Icon as={ArrowForwardIcon} />
                                پاسخگویی به سوال
                              </Link>
                            </Box>
                          </AccordionPanel>
                        </AccordionItem>
                      </Accordion>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Section>
        </Flex>
      </Container>
    </Layout>
  )
}
export async function getServerSideProps(context) {
  const isExpert = context.req.cookies['isExpert']
  //   const token = context.req.cookies['userToken']
  //   const userId = context.req.cookies['userId']
  const { params } = context
  const { catId } = params

  if (!isExpert) {
    return {
      redirect: {
        permanent: false,
        destination: '/401'
      },
      props: {}
    }
  }
  await db.connect()

  const tempQuestions = await TemporaryQuestion.where('catId')
    .equals(catId)
    .where('status')
    .equals(true)
    .sort({ createdAt: -1 })
    .lean()
  console.log(tempQuestions)
  const category = await Category.findById(catId).lean()
  await db.disconnect()
  return {
    props: {
      tempQuestions: tempQuestions.map(db.convertDocToObjInTemporaryQuestion),
      category: db.convertCategoryToObj(category)
    }
  }
}
