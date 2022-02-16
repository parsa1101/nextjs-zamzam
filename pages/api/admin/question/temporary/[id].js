import nc from 'next-connect'
import { isAdmin, isAuth } from '../../../../../utils/auth'
import db from '../../../../../utils/db'
import { onError } from '../../../../../utils/error'
import temporaryQuestions from '../../../../../models/temporaryQuestion'
const handler = nc({
  onError
})
handler.use(isAuth, isAdmin)

handler.get(async (req, res) => {
  await db.connect()

  try {
    const { id } = req.query
    const question = await temporaryQuestions.findById(id)
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
  const question = await temporaryQuestions.findById(id)
  if (question) {
    question.text = req.body.text
    question.full_text = req.body.full_text
    question.status = true
    question.catId = req.body.catId

    await question.save()
    await db.disconnect()
    res.send({ message: 'سوال با موفقیت ویرایش شد' })
  } else {
    await db.disconnect()
    res.status(404).send({ message: 'متاسفانه سوال مورد نظر پیدا نشد!' })
  }
})

handler.delete(async (req, res) => {
  await db.connect()
  const question = await temporaryQuestions.findById(req.query.id)
  if (question) {
    await question.remove()
    await db.disconnect()
    res.send({ message: 'سوال با موفقیت حذف شد' })
  } else {
    await db.disconnect()
    res.status(404).send({ message: 'سوال مورد نظر یافت نشد' })
  }
})

export default handler
