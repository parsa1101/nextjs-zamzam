import nc from 'next-connect'
import Profile from '../../../../models/profile'
import { isAuth } from '../../../../utils/auth'
import db from '../../../../utils/db'
import { onError } from '../../../../utils/error'

const handler = nc({ onError })
handler.use(isAuth)

handler.get(async (req, res) => {
  await db.connect()
  const { userId } = req.query
  try {
    const count = await Profile.count({ userId: userId })
    await db.disconnect()
    res.send(count)
  } catch (err) {
    await db.disconnect()
    res.status(401).send({ message: err.message })
  }
})

export default handler
