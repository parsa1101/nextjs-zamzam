import React, { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Container, Heading, SimpleGrid } from '@chakra-ui/react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'

// const WizardInfo = dynamic(() => import('../components/Wizard/WizardInfo'))
const Section = dynamic(() => import('../components/section'))
const Layout = dynamic(() => import('../components/layouts/article'))

export default function Wizard() {
  const userId = Cookies.get('userId')
  const router = useRouter()

  /* eslint-disable react-hooks/exhaustive-deps */

  useEffect(() => {
    if (userId === undefined) {
      return router.push('/login?redirect=/wizard')
    }
  }, [userId])

  return (
    <Layout title="Works">
      <Container>
        <Heading as="h3" fontSize={20} mb={4}>
          ثبت / ویرایش اطلاعات
        </Heading>

        <Section>
          <SimpleGrid columns={[1, 1, 1]} gap={6}>
            {/* {userId && <WizardInfo />} */}
          </SimpleGrid>
        </Section>
      </Container>
    </Layout>
  )
}
