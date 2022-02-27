import React from 'react'

import dynamic from 'next/dynamic'

import Category from '../../../models/category'

import { Box, Container } from '@chakra-ui/react'
import db from '../../../utils/db'

import User from '../../../models/user'

const AdminLayout = dynamic(() => import('../../../components/layouts/admin'))

const EditCategory = dynamic(() =>
  import('../../../components/admin/categories/EditCategory')
)

export default function EditCategoryScreen({ category, categories, token }) {
  return (
    <AdminLayout>
      <Container maxW="container.xl" p={5}>
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" bg="white">
          <EditCategory
            categories={categories}
            category={category}
            token={token}
          />
        </Box>
      </Container>
    </AdminLayout>
  )
}

export async function getServerSideProps(context) {
  const { params } = context
  const { id } = params
  const userId = context.req.cookies['userId']

  const token = context.req.cookies['userToken']

  await db.connect()
  const category = await Category.findById(id).lean()
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
      category: db.convertCategoryToObj(category),
      categories: categories.map(db.convertCategoryToObj),
      token
    }
  }
}

// export default dynamic(() => Promise.resolve(EditCategory), { ssr: false })
