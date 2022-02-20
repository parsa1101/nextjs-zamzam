import db from '../../../utils/db'
import nc from 'next-connect'
import User from '../../../models/user'
import { isAuth } from '../../../utils/auth'
import { onError } from '../../../utils/error'

const handler = nc({
  onError
})
handler.use(isAuth)

handler.post(async (req, res) => {
  await db.connect()
  const { userId } = req.query
  if (req.body.token === '0') {
    const user = await User.findByIdAndUpdate(userId, { token: null })
    await db.disconnect()
    res.send(user)
  } else {
    const user = await User.findById(userId)

    await db.disconnect()
    res.send(user)
  }
})

handler.get(async (req, res) => {
  await db.connect()
  const { userId } = req.query
  const user = await User.findById(userId)
  await db.disconnect()
  res.send(user)
})

export default handler
