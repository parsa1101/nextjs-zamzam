import React from 'react'

import dynamic from 'next/dynamic'

import NextLink from 'next/link'

import {
  Button,
  Center,
  List,
  ListItem,
  Container,
  Box
} from '@chakra-ui/react'

import { AddIcon } from '@chakra-ui/icons'

import db from '../../../utils/db'

import User from '../../../models/user'

import Category from '../../../models/category'

const AdminLayout = dynamic(() => import('../../../components/layouts/admin'))
const ShowAllCategories = dynamic(() =>
  import('../../../components/admin/categories/ShowAllCategories')
)

export default function AdminCategories({ token, categories }) {
  console.log(categories)
  return (
    <AdminLayout>
      <Container maxW="container.xl" p={5}>
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" bg="white">
          <Box
            borderWidth="1px"
            borderRadius="lg"
            borderColor="gray"
            overflow="hidden"
            bg="white"
            alignItems="center"
            justifyContent="space-between"
            m={15}
          >
            <Center>
              <Box
                w="90%"
                h="auto"
                bg="white"
                borderRadius="2px"
                mt={10}
                mb={20}
              >
                <List>
                  <ListItem>
                    <NextLink href={`/admin/category/insert`} passHref>
                      <Button
                        colorScheme="teal"
                        size="md"
                        rightIcon={<AddIcon />}
                        mb={5}
                      >
                        ایجاد دسته بندی جدید
                      </Button>
                    </NextLink>
                  </ListItem>
                  <ShowAllCategories token={token} allCategories={categories} />
                </List>
              </Box>
            </Center>
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
  const categories = await Category.find({})
    .sort({ createdAt: -1 })
    .populate('parrent_id', 'name', Category)
    .lean()

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
      categories: categories.map(db.convertCategoryToObj2)
    }
  }
}
// export default dynamic(() => Promise.resolve(AdminCategories), { ssr: false })
