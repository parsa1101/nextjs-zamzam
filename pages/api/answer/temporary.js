import nc from 'next-connect'
import { isAuth } from '../../../utils/auth'
import db from '../../../utils/db'
import { onError } from '../../../utils/error'
import TemporaryAnswer from '../../../models/temporaryAnswer'

const handler = nc({
  onError
})
handler.use(isAuth)

handler.post(async (req, res) => {
  await db.connect()

  try {
    const { userId, questionId, mediaPath, text, full_text, fileExtension } =
      req.body

    const answer = await TemporaryAnswer.findOne({
      userId: userId,
      questionId: questionId
    })
    if (answer) {
      await TemporaryAnswer.findByIdAndUpdate(answer._id, {
        mediaPath: mediaPath,
        text: text,
        full_text: full_text,
        fileExtension: fileExtension
      })
    } else {
      const newAnswer = new TemporaryAnswer({
        userId: userId,
        text: text,
        full_text: full_text,
        mediaPath: `/media/${mediaPath}`,
        questionId: questionId,
        kind: fileExtension
      })

      await newAnswer.save()
    }

    await db.disconnect()
    res.send({
      message: 'جواب شما ثبت شد و پس از تایید در سایت نمایش داده خواهد شد'
    })
  } catch (err) {
    await db.disconnect()
    res.status(401).send({ message: err.message })
  }
})

export default handler
