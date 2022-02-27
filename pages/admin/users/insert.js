import React from 'react'
import dynamic from 'next/dynamic'

const AdminLayout = dynamic(() => import('../../../components/layouts/admin'))
const CreateNewUser = dynamic(() =>
  import('../../../components/users/CreateNewUser')
)

import db from '../../../utils/db'
import User from '../../../models/user'
import Role from '../../../models/role'
import { Box, Container } from '@chakra-ui/react'

export default function InsertUserScreen({ token, roles }) {
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
            <CreateNewUser roles={roles} token={token} />
          </Box>
        </Box>
      </Container>
    </AdminLayout>
  )
}
// export default dynamic(() => Promise.resolve(InsertUser), { ssr: false })
export async function getServerSideProps(context) {
  const userId = context.req.cookies['userId']

  const token = context.req.cookies['userToken']

  await db.connect()
  const authUser = await User.findById(userId).lean()

  const roles = await Role.find({}).lean()

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
      roles: roles.map(db.convertOtherToObject),
      token
    }
  }
}
