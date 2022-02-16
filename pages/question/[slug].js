import React, { useState } from 'react'
import dynamic from 'next/dynamic'

import {
  Container,
  SimpleGrid,
  Center,
  Image,
  Button,
  Flex
} from '@chakra-ui/react'
const Layout = dynamic(() => import('../../components/layouts/article'))
import { WorkImage } from '../../components/work'

const P = dynamic(() => import('../../components/paragraph'))
import db from '../../utils/db'
import Question from '../../models/question'
import Answer from '../../models/answer'
// const Player = dynamic(() => import('../../components/player/Player'))
// const Audio = dynamic(() => import('../../components/player/Audio'))
import { BiMailSend } from 'react-icons/bi'
const SendQuestion = dynamic(() =>
  import('../../components/question/SendQuestion')
)

const QuestionScreen = ({ question, answer }) => {
  // const [player, setPlayer] = useState(null)

  const [showQuestionBox, setShowQuestionBox] = useState(false)

  // const [playerOptions] = useState({
  //   sources: [
  //     {
  //       src: answer.media_path
  //     }
  //   ],
  //   type: 'video/mp4'
  // })

  /* eslint-disable react-hooks/exhaustive-deps */

  // useEffect(() => {
  //   if (player) {
  //     player.src([
  //       {
  //         src: answer.media_path
  //       }
  //     ])
  //   }
  // }, [player, answer.media_path])

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
        <P mt={20}>{answer.full_text}</P>

        <Flex
          mt={20}
          boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
          borderRadius={'15px'}
          w="100%"
          flexDir="column"
          justifyContent="space-between"
        >
          {/* {answer.kind === 'mp4' && (
            <Player
              playerOptions={playerOptions}
              onPlayerInit={setPlayer}
              onPlayerDispose={setPlayer}
            />
          )} */}
          {/* {answer.kind === 'mp3' && <Audio src={answer.media_path} />} */}
        </Flex>

        {!showQuestionBox && (
          <Button
            mt={20}
            variant="solid"
            width="100%"
            colorScheme="teal"
            rightIcon={<BiMailSend />}
            iconSpacing={10}
            onClick={clickHandler}
          >
            مطرح کردن سوال
          </Button>
        )}
        {showQuestionBox && (
          <SendQuestion
            onClicked={clickHandler}
            id={question._id}
            catId={question.catId}
          />
        )}
      </Container>
    </Layout>
  )
}

export default QuestionScreen

export const getStaticPaths = async () => {
  await db.connect()

  const questions = await Question.find({})
  await db.disconnect()

  // generate the paths
  const paths = questions.map(question => ({
    params: { slug: question.slug }
  }))

  return {
    paths,
    fallback: true
  }
}

export async function getStaticProps(context) {
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
