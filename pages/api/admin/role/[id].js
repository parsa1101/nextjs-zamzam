import nc from 'next-connect'
import Role from '../../../../models/role'
import db from '../../../../utils/db'
import { onError } from '../../../../utils/error'
import { isAdmin, isAuth } from '../../../../utils/auth'

const handler = nc({
  onError
})
handler.use(isAuth, isAdmin)

handler.delete(async (req, res) => {
  await db.connect()
  const { id } = req.query

  await Role.findByIdAndDelete(id)

  await db.disconnect()
  res.send('نقش مورد نظر با موفقیت حذف شد.')
})

export default handler
