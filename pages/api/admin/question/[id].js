import nc from 'next-connect'
import { isAdmin, isAuth } from '../../../../utils/auth'
import db from '../../../../utils/db'
import { onError } from '../../../../utils/error'
import Question from '../../../../models/question'
import Answer from '../../../../models/answer'
import User from '../../../../models/user'
import Category from '../../../../models/category'

const handler = nc({
  onError
})
handler.use(isAuth, isAdmin)

handler.get(async (req, res) => {
  await db.connect()

  try {
    const { id } = req.query
    const question = await Question.findById(id)
    await db.disconnect()
    res.send(question)
  } catch (err) {
    await db.disconnect()
    res.status(401).send({ message: err.message })
  }
})

handler.put(async (req, res) => {
  await db.connect()
  const { id } = req.query
  const question = await Question.findById(id)
  const count = await Question.count({ slug: req.body.slug, _id: { $ne: id } })
  console.log(count)
  if (count === 0) {
    if (question) {
      question.text = req.body.text
      question.slug = req.body.slug
      question.full_text = req.body.full_text
      question.catId = req.body.catId
      question.pic_path = req.body.pic_path

      await question.save()
      await db.disconnect()
      res.send({ message: 'احکام مورد نظر با موفقیت ویرایش شد' })
    } else {
      await db.disconnect()
      res.status(404).send({ message: 'سوال مورد نظر یافت نشد' })
    }
  } else {
    await db.disconnect()
    res.status(404).send({ message: 'slug وارد شده تکراری است' })
  }
})

handler.delete(async (req, res) => {
  await db.connect()
  const question = await Question.findById(req.query.id)
  if (question) {
    const answers = await Answer.find({ questionId: req.query.id })
    for (var i = 0, len = answers.length; i < len; i++) {
      answers[i].remove()
    }
    await question.remove()
    const questions = await Question.find({})
      .sort({ createdAt: -1 })
      .populate('userId', 'userName email', User)
      .populate('catId', 'name', Category)

    await db.disconnect()
    res.send(questions)
  } else {
    await db.disconnect()
    res.status(404).send({ message: 'سوال مورد نظر یافت نشد' })
  }
})

export default handler
