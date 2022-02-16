import nc from 'next-connect'
import Question from '../../../models/question'
import db from '../../../utils/db'

const handler = nc()

handler.get(async (req, res) => {
  await db.connect()
  const questions = await Question.find({ status: true })

  await db.disconnect()
  res.send(questions)
})

export default handler
