import nc from 'next-connect'
import City from '../../../../../models/city'
import db from '../../../../../utils/db'
import { onError } from '../../../../../utils/error'

const handler = nc({ onError })

handler.get(async (req, res) => {
  await db.connect()
  const { cityId } = req.query

  const city = await City.findById(cityId)
  await db.disconnect()
  res.send(city)
})

export default handler
