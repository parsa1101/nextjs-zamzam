import React from 'react'

import dynamic from 'next/dynamic'

const AdminLayout = dynamic(() =>
  import('../../../../../components/layouts/admin')
)

const ShowAllTemp = dynamic(() =>
  import('../../../../../components/admin/questions/ShowAllTemp')
)

import { Container } from '@chakra-ui/react'

import db from '../../../../../utils/db'

import TemporaryAnswer from '../../../../../models/temporaryAnswer'

import TemporaryQuestion from '../../../../../models/temporaryQuestion'

import User from '../../../../../models/user'

export default function EditQuestionScreen({ question, answers }) {
  return (
    <AdminLayout>
      <Container maxW="container.xl" p={5}>
        <ShowAllTemp answers={answers} question={question} />
      </Container>
    </AdminLayout>
  )
}

export async function getServerSideProps(context) {
  const { params } = context
  const { id } = params

  const userId = context.req.cookies['userId']

  await db.connect()

  const user = await User.findById(userId).lean()

  const answers = await TemporaryAnswer.find({ questionId: id }).lean()

  const question = await TemporaryQuestion.findById(id).lean()

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
      answers: answers.map(db.convertDocToObjINAnswer),
      question: db.convertDocToObjInTemporaryQuestion(question)
    }
  }
}

// export default dynamic(() => Promise.resolve(EditQuestionScreen), {
//   ssr: false
// })
