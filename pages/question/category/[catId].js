/* eslint-disable react-hooks/exhaustive-deps */
import dynamic from 'next/dynamic'

import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  CircularProgress,
  CloseButton,
  Container,
  Heading,
  SimpleGrid,
  Text
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
// import { getError } from '../../../utils/error'
import useSWR from 'swr'

const QuestionByCat = ({ questions, catName, catId }) => {
  const fetcher = (...args) => fetch(...args).then(res => res.json())

  const { data, error } = useSWR(`/api/category/parrent/${catId}`, fetcher)

  if (error)
    return (
      <Alert
        status="success"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="200px"
      >
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          خطا!
          <CloseButton position="absolute" right="8px" top="8px" />
        </AlertTitle>
        <AlertDescription maxWidth="sm">{error}</AlertDescription>
      </Alert>
    )
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
