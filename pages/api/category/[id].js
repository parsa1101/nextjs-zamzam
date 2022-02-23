import nc from 'next-connect'
import Category from '../../../models/category'

import db from '../../../utils/db'
import { onError } from '../../../utils/error'

const handler = nc({
  onError
})

handler.get(async (req, res) => {
  await db.connect()
  const { id } = req.query
  const subCats = await Category.find({ parrent_id: id })

  const cats = []

  for (var i = 0, len = subCats.length; i < len; i++) {
    const count = await Category.count({ parrent_id: subCats[i]._id })

    if (count === 0) {
      cats.push({ _id: subCats[i]._id, name: subCats[i].name, hasChild: false })
    } else {
      cats.push({ _id: subCats[i]._id, name: subCats[i].name, hasChild: true })
    }
  }
  await db.disconnect()

  res.send(cats)
})

export default handler
