import nc from 'next-connect'
import TempQuestion from '../../../../models/temporaryQuestion'
import TempAnswer from '../../../../models/temporaryAnswer'
import { isAuth } from '../../../../utils/auth'
import db from '../../../../utils/db'
import { onError } from '../../../../utils/error'

const handler = nc({
  onError
})
handler.use(isAuth)

handler.get(async (req, res) => {
  await db.connect()
  const userId = req.user._id

  const all = await TempQuestion.find({})
  let questions = []

  //do not show questions that user answered before
  for (var i = 0, len = all.length; i < len; i++) {
    const count = await TempAnswer.count({
      questionId: all[i]._id.toString(),
      userId: userId
    })

    if (count === 0) {
      questions.push(all[i])
    }
  }

  await db.disconnect()
  res.send(questions)
})

export default handler
