import React from 'react'
import dynamic from 'next/dynamic'

import db from '../../../../../utils/db'

import TemporaryAnswer from '../../../../../models/temporaryAnswer'
import { Box, Container } from '@chakra-ui/react'
import User from '../../../../../models/user'

const AdminLayout = dynamic(() =>
  import('../../../../../components/layouts/admin')
)

const EditTempAnswer = dynamic(() =>
  import('../../../../../components/admin/questions/EditTempAnswer')
)

function EditAnswerScreen({ answer, token }) {
  return (
    <AdminLayout>
      <Container maxW="container.xl" p={5}>
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" bg="white">
          <EditTempAnswer answer={answer} token={token} />
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
  const user = await User.findById(userId).lean()
  const answer = await TemporaryAnswer.findById(id).lean()

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
      answer: db.convertDocToObjINAnswer(answer),
      token
    }
  }
}

export default dynamic(() => Promise.resolve(EditAnswerScreen), { ssr: false })
