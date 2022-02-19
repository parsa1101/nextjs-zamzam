import nc from 'next-connect'
import Category from '../../../../models/category'

import db from '../../../../utils/db'
import { onError } from '../../../../utils/error'

const handler = nc({
  onError
})

let findCat = null

handler.get(async (req, res) => {
  await db.connect()
  const { id } = req.query

  const cat = await Category.findById(id)

  findCat = cat
  // console.log('cat:', findCat)

  if (cat.parrent_id) {
    getFirstParrentId(cat.parrent_id)
  }
  await db.disconnect()
  res.send(findCat)
})

async function getFirstParrentId(id) {
  const cat = await Category.findById(id)
  if (cat.parrent_id) {
    getFirstParrentId(cat.parrent_id)
  } else {
    findCat = { ...cat }
  }
}
export default handler
