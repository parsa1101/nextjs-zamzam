import db from '../../../../utils/db'
import nc from 'next-connect'
import Favorite from '../../../../models/favorite'
import Question from '../../../../models/question'
import { onError } from '../../../../utils/error'
import { isAuth } from '../../../../utils/auth'

const handler = nc({
  onError
})
handler.use(isAuth)

handler.get(async (req, res) => {
  const { userId } = req.query

  await db.connect()

  const favorite = await Favorite.findOne({ userId: userId })
  const questions = []
  if (favorite) {
    let questionIds = []
    questionIds = favorite.questionId
    let question
    for (var i = 0, len = questionIds.length; i < len; i++) {
      question = await Question.findById(questionIds[i])
      questions.push(question)
    }
  }
  await db.disconnect()
  res.send(questions)
})

export default handler
