import React from 'react'
import dynamic from 'next/dynamic'

import db from '../../../utils/db'
import User from '../../../models/user'
import Category from '../../../models/category'

import { Box, Container } from '@chakra-ui/react'
const AdminLayout = dynamic(() => import('../../../components/layouts/admin'))
const InsertCategory = dynamic(() =>
  import('../../../components/admin/categories/InsertCategory')
)

export default function InsertCategoryScreen({ token, categories }) {
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
            <InsertCategory token={token} categories={categories} />
          </Box>
        </Box>
      </Container>
    </AdminLayout>
  )
}
// export default dynamic(() => Promise.resolve(InsertCategory), { ssr: false })

export async function getServerSideProps(context) {
  const userId = context.req.cookies['userId']

  const token = context.req.cookies['userToken']

  await db.connect()
  const authUser = await User.findById(userId).lean()

  const categories = await Category.find({}).lean()

  await db.disconnect()
  if (!userId || !authUser.isAdmin) {
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
      categories: categories.map(db.convertCategoryToObj),
      token
    }
  }
}
