import React from 'react'
import dynamic from 'next/dynamic'

import { Flex, Container } from '@chakra-ui/react'

// import AdminLayout from '../../components/layouts/admin'
const AdminLayout = dynamic(() => import('../../components/layouts/admin'))
// import PageContent from '../../components/admin/dashboard/PageContent'
const PageContent = dynamic(() =>
  import('../../components/admin/dashboard/PageContent')
)

// import ShowQuestionsChart from '../../components/admin/dashboard/ShowQuestionsChart'
const ShowQuestionsChart = dynamic(() =>
  import('../../components/admin/dashboard/ShowQuestionsChart')
)

// import SeenQuestionsChart from '../../components/admin/dashboard/SeenQuestionsChart'
const SeenQuestionsChart = dynamic(() =>
  import('../../components/admin/dashboard/SeenQuestionsChart')
)

export default function Dashboard() {
  return (
    <AdminLayout>
      <PageContent>
        <Container maxW="container.xl" p={0}>
          <Flex
            h={{ base: 'auto', md: '100vh' }}
            py={[0, 10, 20]}
            direction={{ base: 'column-reverse', md: 'row' }}
          >
            <SeenQuestionsChart />
            <ShowQuestionsChart />
          </Flex>
        </Container>
      </PageContent>
    </AdminLayout>
  )
}
