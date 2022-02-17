import dynamic from 'next/dynamic'

import { Container, Heading, SimpleGrid, Text } from '@chakra-ui/react'
const Layout = dynamic(() => import('../../../components/layouts/article'))
const Section = dynamic(() => import('../../../components/section'))
import { GridItem } from '../../../components/grid-item'

import db from '../../../utils/db'
import Question from '../../../models/question'
import Category from '../../../models/category'
// import 'antd/dist/antd.css'
// const TreeCatSelect = dynamic(() =>
//   import('../../../components/treeCatSelect/TreeSelect')
// )
// import { useEffect } from 'react'
// import axios from 'axios'
// import { getError } from '../../../utils/error'

const QuestionByCat = ({ questions, catName }) => {
  // const [firstParrent, changeParrent] = useState(null)

  /* eslint-disable react-hooks/exhaustive-deps */

  // useEffect(() => {
  //   async function getFirstParrentId() {
  //     try {
  //       const { data } = await axios.get(`/api/category/parrent/${catId}`)
  //       console.log('parrent : ', data)
  //       changeParrent(data)
  //     } catch (err) {
  //       console.log(getError(err))
  //     }
  //   }
  //   getFirstParrentId()
  // }, [catId])

  return (
    <Layout title="Questions">
      <Container>
        <Heading as="h6" fontSize={18} mb={20} variant="section-title">
          نمایش {catName}:
        </Heading>

        <Section delay={0.1}>
          {/* {firstParrent && (
            <TreeCatSelect
              catId={firstParrent._id}
              catName={firstParrent.name}
            />
          )} */}

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

export const getStaticPaths = async () => {
  await db.connect()

  const cats = await Category.find({})
  await db.disconnect()

  // generate the paths
  const paths = cats.map(cat => ({
    params: { catId: cat._id.toString() }
  }))

  return {
    paths,
    fallback: true
  }
}

export async function getStaticProps(context) {
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
