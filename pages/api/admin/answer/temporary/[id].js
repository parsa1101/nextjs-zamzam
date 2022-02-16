import nc from 'next-connect'
import Answer from '../../../../../models/answer'
import Question from '../../../../../models/question'
import TemporaryAnswer from '../../../../../models/temporaryAnswer'
import TemporaryQuestion from '../../../../../models/temporaryQuestion'
import { isAdmin, isAuth } from '../../../../../utils/auth'
import db from '../../../../../utils/db'
import { onError } from '../../../../../utils/error'
const handler = nc({
  onError
})
handler.use(isAuth, isAdmin)

handler.get(async (req, res) => {
  await db.connect()

  try {
    const { id } = req.query
    const answers = await TemporaryAnswer.find({ questionId: id })
    await db.disconnect()
    res.send(answers)
  } catch (err) {
    await db.disconnect()
    res.status(401).send({ message: err.message })
  }
})

handler.post(async (req, res) => {
  await db.connect()
  const { id } = req.query

  const tempAnswer = await TemporaryAnswer.findById(id)

  const tempQuestion = await TemporaryQuestion.findById(tempAnswer.questionId)

  const { text, full_text, media_path, kind } = req.body

  const slug = tempQuestion.text.replaceAll(' ', '-')

  const question = new Question({
    slug: slug,
    userId: tempQuestion.userId,
    text: tempQuestion.text,
    full_text: tempQuestion.full_text,
    catId: tempQuestion.catId,
    pic_path: '/images/',
    status: true
  })

  const newQuestion = await question.save()

  if (media_path) {
    const answer = new Answer({
      userId: tempAnswer.userId,
      text: text,
      full_text: full_text,
      media_path: media_path,
      questionId: newQuestion._id,
      status: true,
      kind: kind
    })
    await answer.save()
  } else {
    const answer = new Answer({
      userId: tempAnswer.userId,
      text: text,
      full_text: full_text,
      media_path: tempAnswer.mediaPath,
      questionId: newQuestion._id,
      status: true,
      kind: tempAnswer.kind
    })
    await answer.save()
  }

  //delete all answers
  await TemporaryAnswer.deleteMany({ questionId: tempAnswer.questionId })
  await tempQuestion.remove()
  await db.disconnect()
  res.send({ message: 'سوال و جواب با موفقیت ثبت شد.' })
})

handler.delete(async (req, res) => {
  await db.connect()
  const { id } = req.query
  const answer = await TemporaryAnswer.findById(id)
  if (answer) {
    await answer.remove()
    await db.disconnect()
    res.send({ message: 'جواب با موفقیت حذف شد' })
  } else {
    await db.disconnect()
    res.status(404).send({ message: 'جواب مورد نظر یافت نشد' })
  }
})

handler.put(async (req, res) => {
  await db.connect()

  const { id } = req.query
  console.log(id)
  const answer = await TemporaryAnswer.findByIdAndUpdate(id, {
    kind: '0',
    mediaPath: ''
  })
  if (answer) {
    await db.disconnect()
    res.send({ message: 'فایل با موفقیت حذف شد' })
  } else {
    await db.disconnect()
    res.status(404).send({ message: 'جواب مورد نظر یافت نشد' })
  }
})

export default handler
