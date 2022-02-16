import nc from 'next-connect'
import { isAdmin, isAuth } from '../../../../utils/auth'
import db from '../../../../utils/db'
import Role from '../../../../models/role'
import { onError } from '../../../../utils/error'

const handler = nc({ onError })
handler.use(isAuth, isAdmin)

handler.get(async (req, res) => {
  await db.connect()
  const roles = await Role.find({}).sort({ createdAt: -1 })
  await db.disconnect()
  res.send(roles)
})

export default handler
