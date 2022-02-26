import React from 'react'
import dynamic from 'next/dynamic'

const AdminLayout = dynamic(() =>
  import('../../../../components/layouts/admin')
)

import { Container } from '@chakra-ui/react'

import db from '../../../../utils/db'
import Answer from '../../../../models/answer'

import User from '../../../../models/user'
const EditAnswer = dynamic(() =>
  import('../../../../components/admin/questions/EditAnswer')
)

export default function EditAnswerScreen({ answer, userId, token }) {
  return (
    <AdminLayout>
      <Container maxW="container.xl" p={5}>
        <EditAnswer answer={answer} userId={userId} token={token} />
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
  const answer = await Answer.findOne({ questionId: id }).lean()

  // if (!answer){
  //   const newAnswer = new Answer({
  //     userId: userId,
  //     text: 'text',
  //     full_text: 'full_text',

  //     questionId: questionId,
  //     kind: fileExtension
  //   })

  //   await newAnswer.save()
  // }
  const user = await User.findById(userId).lean()

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
      userId,
      token
    }
  }
}

// export default dynamic(() => Promise.resolve(EditAnswerScreen), { ssr: false })
