import nc from 'next-connect'
import Answer from '../../../../../models/answer'
import Question from '../../../../../models/question'
import TemporaryQuestion from '../../../../../models/temporaryQuestion'
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

  const { text, full_text, kind } = req.body

  if (req.body.media_path) {
    await Answer.findByIdAndUpdate(
      id,
      {
        text: text,
        full_text: full_text,
        kind: kind,
        media_path: req.body.media_path,
        status: true
      },
      { upsert: true }
    )
  } else {
    await Answer.findByIdAndUpdate(
      id,
      {
        text: text,
        full_text: full_text,
        status: true
      },
      { upsert: true }
    )
  }
  await db.disconnect()
  return res.send({ message: '  جواب با موفقیت ویرایش شد.' })
})

//remove media_path field
handler.get(async (req, res) => {
  await db.connect()
  const { id } = req.query

  await Answer.findByIdAndUpdate(id, { kind: '0', media_path: '' })
  await db.disconnect()
  return res.send({ message: '  جواب با موفقیت ویرایش شد.' })
})

handler.delete(async (req, res) => {
  await db.connect()
  const { id } = req.query
  const answer = await Answer.findById(id)
  const question = await Question.findById(answer.questionId)

  if (answer) {
    await answer.remove()
    const tempQuestion = new TemporaryQuestion({
      userId: question.userId,
      text: question.text,
      full_text: question.full_text,
      parentId: question.parentId,
      catId: question.catId,
      status: true
    })

    await tempQuestion.save()
    await question.remove()
    await db.disconnect()
    res.send({
      message:
        ' جواب با موفقیت حذف شد و سوال در لیست سوالات جهت پاسخگویی قرار گرفت.'
    })
  } else {
    await db.disconnect()
    res.status(404).send({ message: 'جواب مورد نظر یافت نشد' })
  }
})

export default handler
