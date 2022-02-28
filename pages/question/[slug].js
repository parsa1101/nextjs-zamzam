import React, { useState } from 'react'
import dynamic from 'next/dynamic'

import {
  Container,
  SimpleGrid,
  Center,
  Image,
  Box,
  Heading,
  useColorModeValue
} from '@chakra-ui/react'
const Layout = dynamic(() => import('../../components/layouts/article'))
import { WorkImage } from '../../components/work'

const P = dynamic(() => import('../../components/paragraph'))
import db from '../../utils/db'
import Question from '../../models/question'
import Answer from '../../models/answer'
import ReactPlayer from 'react-player'

const SendQuestion = dynamic(() =>
  import('../../components/question/SendQuestion')
)

const QuestionScreen = ({ question, answer }) => {
  const [showQuestionBox, setShowQuestionBox] = useState(false)

  const clickHandler = () => {
    setShowQuestionBox(!showQuestionBox)
  }
  return (
    <Layout title="show-selected-question">
      <Container>
        {/* <Title>{question.text}</Title> */}
        <Center my={6}>
          <Image src="/images/works/amembo_icon.png" alt="icon" />
        </Center>
        <SimpleGrid columns={1} gap={2}>
          <WorkImage src={question.pic_path} alt={question.text} />
        </SimpleGrid>
        <P mt={20} mb={5}>
          {answer.full_text}
        </P>
        {answer.kind !== '0' && (
          <ReactPlayer
            height={answer.kind !== 'mp4' ? '25%' : ''}
            width={'100%'}
            url={answer.media_path}
            controls={true}
          />
        )}
        <Center py={12} overflow={'auto'}>
          <Box
            role={'group'}
            p={6}
            bg={useColorModeValue('white', 'gray.800')}
            boxShadow={'2xl'}
            rounded={'lg'}
            pos={'relative'}
            zIndex={1}
            w="full"
          >
            <Heading fontSize={'2xl'} fontFamily={'body'} fontWeight={500}>
              مطرح کردن سوال:
            </Heading>

            <SendQuestion
              onClicked={clickHandler}
              id={question._id}
              catId={question.catId}
            />
          </Box>
        </Center>
      </Container>
    </Layout>
  )
}

export default QuestionScreen

export async function getServerSideProps(context) {
  const { params } = context
  const { slug } = params
  await db.connect()
  const question = await Question.findOne({ slug: slug }).lean()
  let seenCount = question.s_count + 1
  await Question.findOneAndUpdate({ _id: question._id }, { s_count: seenCount })
  const answer = await Answer.findOne({ questionId: question._id }).lean()

  await db.disconnect()
  return {
    props: {
      question: db.convertDocToObj(question),
      answer: db.convertDocToObjINAnswer(answer)
    }
  }
}
