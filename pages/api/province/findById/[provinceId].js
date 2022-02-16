import nc from 'next-connect'
import Province from '../../../../models/province'
import db from '../../../../utils/db'
import { onError } from '../../../../utils/error'

const handler = nc({ onError })

handler.get(async (req, res) => {
  await db.connect()
  const { provinceId } = req.query

  const province = await Province.findById(provinceId)
  await db.disconnect()
  res.send(province)
})

export default handler
