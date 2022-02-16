import nc from 'next-connect'
// import { isAuth } from '../../../utils/auth'
import db from '../../../utils/db'
import { onError } from '../../../utils/error'
import TemporaryQuestion from '../../../models/temporaryQuestion'

const handler = nc({
  onError
})

handler.post(async (req, res) => {
  await db.connect()
  let values
  if (req.body.userId) {
    values = {
      text: req.body.text,
      full_text: req.body.text,
      userId: req.body.userId,
      parentId: req.body.parentId,
      catId: req.body.catId
    }
  } else {
    values = {
      text: req.body.text,
      full_text: req.body.text,
      parentId: req.body.parentId,
      catId: req.body.catId
    }
  }

  const question = new TemporaryQuestion(values)
  try {
    await question.save()
    await db.disconnect()
    res.send({ message: 'کاربر گرامی: سوال شما با موفقیت ثبت شد' })
  } catch (err) {
    await db.disconnect()
    res.status(401).send({ message: err.message })
  }
})

export default handler
