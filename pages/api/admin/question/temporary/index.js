import nc from 'next-connect'
import { isAuth, isAdmin } from '../../../../../utils/auth'
import db from '../../../../../utils/db'
import { onError } from '../../../../../utils/error'

import User from '../../../../../models/user'
import TemporaryQuestion from '../../../../../models/temporaryQuestion'
import TemporaryAnswer from '../../../../../models/temporaryAnswer'
import Category from '../../../../../models/category'

const handler = nc({
  onError
})
handler.use(isAuth, isAdmin)

handler.get(async (req, res) => {
  await db.connect()
  // let answers = [];
  let tempQuestions = []
  const questions = await TemporaryQuestion.find({})
    .sort({ createdAt: -1 })
    .populate('userId', 'nameFamily email', User)
    .populate('catId', 'name', Category)

  for (var i = 0, len = questions.length; i < len; i++) {
    const count = await TemporaryAnswer.count({ questionId: questions[i] })
    tempQuestions.push({
      _id: questions[i]._id,
      text: questions[i].text,
      full_text: questions[i].full_text,
      count_answers: count,
      user_nameFamily: questions[i].userId
        ? questions[i].userId.user_nameFamily
        : '',
      cat_name: questions[i].catId ? questions[i].catId.name : '',
      createdAt: questions[i].createdAt
    })
  }
  await db.disconnect()
  res.send(tempQuestions)
})

export default handler
