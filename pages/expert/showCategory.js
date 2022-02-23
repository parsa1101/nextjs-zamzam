import React from 'react'
import dynamic from 'next/dynamic'

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Container,
  Box,
  Center,
  Image,
  useColorModeValue
} from '@chakra-ui/react'

import db from '../../utils/db'

import Category from '../../models/category'
const Layout = dynamic(() => import('../../components/layouts/article'))
const SubCat = dynamic(() => import('../../components/expert/SubCat'))

const Section = dynamic(() => import('../../components/section'))
export default function ShowQuestions({ categories, token }) {
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
          جهت نمایش سوال لطفا دسته مورد نظر را انتخاب نمایید.
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
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>شماره</Th>
                  <Th>نام دسته بندی</Th>
                </Tr>
              </Thead>
              <Tbody>
                {categories.map((cat, index) => (
                  <Tr key={index}>
                    <Td>{index + 1}</Td>
                    <Td>
                      <SubCat
                        catId={cat._id}
                        catName={cat.name}
                        token={token}
                      />
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
  const token = context.req.cookies['userToken']
  const userId = context.req.cookies['userId']

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
  const categories = await Category.find({ parrent_id: undefined }).lean()
  await db.disconnect()
  return {
    props: {
      categories: categories.map(db.convertCategoryToObj),
      token,
      userId
    }
  }
}
