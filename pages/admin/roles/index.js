import React from 'react'

import dynamic from 'next/dynamic'

const AdminLayout = dynamic(() => import('../../../components/layouts/admin'))

import { Container, Box } from '@chakra-ui/react'

import db from '../../../utils/db'

import User from '../../../models/user'

import Role from '../../../models/role'

import ShowAllRoles from '../../../components/admin/roles/ShowAllRoles'

export default function AdminRoles({ allRoles, token }) {
  return (
    <AdminLayout>
      <Container maxW="container.xl" p={5}>
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" bg="white">
          <ShowAllRoles allRoles={allRoles} token={token} />
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
  const roles = await Role.find({}).lean()

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
      allRoles: roles.map(db.convertOtherToObject)
    }
  }
}
// export default dynamic(() => Promise.resolve(AdminRoles), { ssr: false })
