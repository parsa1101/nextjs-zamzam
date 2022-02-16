import nc from 'next-connect'
import { isAuth, isAdmin } from '../../../../utils/auth'
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
  // let infos = []

  const questions = await Question.find({})
    .sort({ createdAt: -1 })
    .populate('userId', 'nameFamily email', User)
    .populate('catId', 'name', Category)

  await db.disconnect()

  res.send(questions)
})

handler.post(async (req, res) => {
  await db.connect()
  const { text, full_text, slug, pic_path, catId, userId } = req.body

  // const slug = text.replaceAll(' ', '-')

  const search = await Question.findOne({ slug: slug })
  if (search) {
    await db.disconnect()
    res.status(401).send({ message: 'slug وارد شده تکراری است', id: '' })
  } else {
    const newQuestion = new Question({
      slug: slug,
      userId: userId,
      text: text,
      full_text: full_text,
      catId: catId,
      pic_path: `/images/${pic_path}`
    })

    const question = await newQuestion.save()

    const newAnswer = new Answer({
      userId: req.user._id,
      text: ' جواب ',
      full_text: 'متن جواب به طور کامل',
      questionId: question._id
    })

    await newAnswer.save()
    await db.disconnect()
    res.send({
      message: 'ثبت احکام جدید با موفقیت انجام شد',
      id: newAnswer._id
    })
  }
})

export default handler
