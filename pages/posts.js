import dynamic from 'next/dynamic'
import { Container, Heading, SimpleGrid } from '@chakra-ui/react'
// import Layout from '../components/layouts/article'
const Layout = dynamic(() => import('../components/layouts/article'))
// import Section from '../components/section'
const Section = dynamic(() => import('../components/section'))

import { GridItem } from '../components/grid-item'

import { useEffect, useState } from 'react'

import axios from 'axios'

const Posts = () => {
  const [questions, setQuestions] = useState([])

  /* eslint-disable react-hooks/exhaustive-deps */

  useEffect(() => {
    async function getQuestions() {
      try {
        const { data } = await axios.get(`/api/questions`)
        setQuestions(data)
      } catch (err) {
        alert(err)
      }
    }
    getQuestions()
  }, [])

  return (
    <Layout title="Posts">
      <Container>
        <Heading as="h3" fontSize={20} mb={4}>
          جدیدترین احکام
        </Heading>

        <Section delay={0.1}>
          <SimpleGrid columns={[1, 2, 2]} gap={6}>
            {questions.map((question, index) => (
              <GridItem
                key={index}
                title={question.text}
                thumbnail={question.pic_path}
                href={`/question/${question.slug}`}
              />
            ))}
          </SimpleGrid>
        </Section>

        <Section></Section>
      </Container>
    </Layout>
  )
}

export default Posts
