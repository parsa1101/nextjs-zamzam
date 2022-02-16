import nc from 'next-connect'
import Role from '../../../../../models/role'
import db from '../../../../../utils/db'
import { onError } from '../../../../../utils/error'
import { isAdmin, isAuth } from '../../../../../utils/auth'

const handler = nc({
  onError
})
handler.use(isAuth, isAdmin)

handler.delete(async (req, res) => {
  await db.connect()
  const { info } = req.query
  const id = info[0]
  const item = info[1]
  const role = await Role.findById(id)
  if (role) {
    const newRole = await Role.findByIdAndUpdate(
      id,
      { $pull: { permissions: item } },
      { new: true, upsert: true }
    )
    await db.disconnect()
    res.send(newRole)
  } else {
    await db.disconnect()
    res.status(404).send({ message: 'نقش مورد نظر یافت نشد' })
  }
})

export default handler
