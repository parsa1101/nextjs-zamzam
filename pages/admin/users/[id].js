import React from 'react'
import dynamic from 'next/dynamic'

const AdminLayout = dynamic(() => import('../../../components/layouts/admin'))
const EditUser = dynamic(() => import('../../../components/users/EditUser'))

import db from '../../../utils/db'
import User from '../../../models/user'
import Role from '../../../models/role'
import { Box, Container } from '@chakra-ui/react'

export default function EditUserScreen({ token, user, roles }) {
  const userRoles = user.roles

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
            <EditUser
              user={user}
              token={token}
              roles={roles}
              uRoles={userRoles}
            />
          </Box>
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
  const authUser = await User.findById(userId).lean()
  const user = await User.findById(id).lean()
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
      user: db.convertUserToObj(user),
      roles: roles.map(db.convertOtherToObject),
      token
    }
  }
}

// export default dynamic(() => Promise.resolve(EditUser), { ssr: false })
