import nc from 'next-connect'
import Province from '../../../models/province'
import db from '../../../utils/db'

const handler = nc()

handler.get(async (req, res) => {
  await db.connect()

  const results = await Province.find().lean()
  //   const provinces = results.map(db.convertDocToObj);
  await db.disconnect()
  res.send(results)
})

export default handler
