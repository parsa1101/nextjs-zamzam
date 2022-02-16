import nc from 'next-connect'
import Category from '../../../../../models/category'
import Question from '../../../../../models/question'
import User from '../../../../../models/user'
import { isAdmin, isAuth } from '../../../../../utils/auth'
import db from '../../../../../utils/db'
import { onError } from '../../../../../utils/error'

const handler = nc({
  onError
})
handler.use(isAuth, isAdmin)

handler.put(async (req, res) => {
  await db.connect()
  const { id } = req.query
  const question = await Question.findById(id)
  if (question) {
    question.status = req.body.status

    await question.save()
    await db.disconnect()
    const questions = await Question.find({})
      .sort({ createdAt: -1 })
      .populate('userId', 'userName email', User)
      .populate('catId', 'name', Category)

    res.send(questions)
  } else {
    await db.disconnect()
    res.status(404).send({ message: 'question Not Found' })
  }
})

export default handler
