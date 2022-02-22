/* eslint-disable react-hooks/exhaustive-deps */
import dynamic from 'next/dynamic'

import {
  CircularProgress,
  Container,
  Heading,
  SimpleGrid,
  Text,
  useToast
} from '@chakra-ui/react'
const Layout = dynamic(() => import('../../../components/layouts/article'))
const Section = dynamic(() => import('../../../components/section'))
import { GridItem } from '../../../components/grid-item'

import db from '../../../utils/db'
import Question from '../../../models/question'
import Category from '../../../models/category'
import TreeCatSelect from '../../../components/TreeCatSelect'

import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box
} from '@chakra-ui/react'

// import axios from 'axios'
// import {  } from '../../../utils/error'
import useSWR from 'swr'

const QuestionByCat = ({ questions, catName, catId }) => {
  const fetcher = (...args) => fetch(...args).then(res => res.json())

  const toast = useToast()

  const { data } = useSWR(`/api/category/parrent/${catId}`, fetcher, {
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      // Never retry on 404.
      if (error) {
        toast({
          title: 'خطا',
          description: 'متاسفانه در بازیابی اطلاعات مشکلی به وجود آمده است.',
          status: 'error',
          duration: 9000
        })
      }

      if (retryCount >= 10) return

      // Retry after 5 seconds.
      setTimeout(() => revalidate({ retryCount }), 5000)
    }
  })

  if (!data) return <CircularProgress />

  return (
    <Layout title="Questions">
      <Container>
        <Heading as="h6" fontSize={18} mb={20} variant="section-title">
          نمایش {catName}:
        </Heading>

        <Section delay={0.1}>
          {data.count > 0 && (
            <Box bg={'#ede0d4'}>
              <Accordion allowToggle>
                <AccordionItem>
                  <h2>
                    <AccordionButton>
                      <Box flex="1" textAlign="left">
                        نمایش زیر دسته ها
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <TreeCatSelect catId={catId} />
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </Box>
          )}
          {questions.length === 0 && (
            <Text fontSize="xl" mt={10}>
              متاسفانه سوالی مطرح نشده است !
            </Text>
          )}
          <SimpleGrid columns={[1, 2, 2]} gap={6} mt={10}>
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
      </Container>
    </Layout>
  )
}

// export const getStaticPaths = async () => {
//   await db.connect()

//   const cats = await Category.find({})
//   await db.disconnect()

//   // generate the paths
//   const paths = cats.map(cat => ({
//     params: { catId: cat._id.toString() }
//   }))

//   return {
//     paths,
//     fallback: true
//   }
// }

export async function getServerSideProps(context) {
  const { params } = context
  const { catId } = params
  await db.connect()

  const questions = await Question.find({ catId: catId }).lean()
  const cat = await Category.findById(catId)

  await db.disconnect()
  return {
    props: {
      questions: questions.map(db.convertDocToObj),
      catName: cat.name,
      catId: catId
    }
  }
}

export default QuestionByCat
