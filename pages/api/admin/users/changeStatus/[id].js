import nc from 'next-connect'
import { isAdmin, isAuth } from '../../../../../utils/auth'
import User from '../../../../../models/user'
import db from '../../../../../utils/db'

const handler = nc()
handler.use(isAuth, isAdmin)

handler.put(async (req, res) => {
  await db.connect()
  const user = await User.findById(req.query.id)
  if (user) {
    if (user.status === '0') {
      user.status = '1'
    } else {
      user.status = '0'
    }
    await user.save()
    const users = await User.find({}).sort({ createdAt: -1 })
    await db.disconnect()
    res.send(users)
  } else {
    await db.disconnect()
    res.status(404).send({ message: 'کاربر موردنظر یافت نشد' })
  }
})
export default handler
