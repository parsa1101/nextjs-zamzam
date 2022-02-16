import db from '../../../utils/db'
import nc from 'next-connect'
import Ui from '../../../models/ui'
import { onError } from '../../../utils/error'
import { isAuth } from '../../../utils/auth'

const handler = nc({
  onError
})
handler.use(isAuth)

handler.get(async (req, res) => {
  const { userId } = req.query
  await db.connect()
  const count = await Ui.count({ userId: userId })

  if (count === 0) {
    await Ui.insertMany({ userId: userId })
  }
  const value = await Ui.findOne({ userId: userId })

  await db.disconnect()

  res.send(value)
})

export default handler
