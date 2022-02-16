import nc from 'next-connect'
import { isAuth, isAdmin } from '../../../../utils/auth'
import db from '../../../../utils/db'
import { onError } from '../../../../utils/error'
import Category from '../../../../models/category'
const handler = nc({
  onError
})
handler.use(isAuth, isAdmin)

handler.get(async (req, res) => {
  await db.connect()
  const categories = await Category.find({})
    .sort({ createdAt: -1 })
    .populate('parrent_id', 'name', Category)

  await db.disconnect()
  res.send(categories)
})

export default handler
