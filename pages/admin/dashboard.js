import React from 'react'
import dynamic from 'next/dynamic'

import { Flex, Container } from '@chakra-ui/react'

import db from '../../utils/db'
import User from '../../models/user'

const AdminLayout = dynamic(() => import('../../components/layouts/admin'))
const PageContent = dynamic(() =>
  import('../../components/admin/dashboard/PageContent')
)

const ShowQuestionsChart = dynamic(() =>
  import('../../components/admin/dashboard/ShowQuestionsChart')
)

const SeenQuestionsChart = dynamic(() =>
  import('../../components/admin/dashboard/SeenQuestionsChart')
)

// import ShowQuestionsChart from '../../components/admin/dashboard/ShowQuestionsChart'
// import SeenQuestionsChart from '../../components/admin/dashboard/SeenQuestionsChart'
export default function Dashboard({ token }) {
  return (
    <AdminLayout>
      <PageContent>
        <Container maxW="container.xl" p={0}>
          <Flex
            h={{ base: 'auto', md: '100vh' }}
            py={[0, 10, 20]}
            direction={{ base: 'column-reverse', md: 'row' }}
          >
            <SeenQuestionsChart token={token} />
            <ShowQuestionsChart token={token} />
          </Flex>
        </Container>
      </PageContent>
    </AdminLayout>
  )
}
export async function getServerSideProps(context) {
  const userId = context.req.cookies['userId']
  const token = context.req.cookies['userToken']

  await db.connect()

  const user = await User.findById(userId).lean()

  await db.disconnect()

  if (!userId && !user.isAdmin) {
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
      userId,
      token
    }
  }
}
