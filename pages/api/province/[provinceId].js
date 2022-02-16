import db from '../../../utils/db'
import nc from 'next-connect'
import Province from '../../../models/province'
import City from '../../../models/city'
import { onError } from '../../../utils/error'

const handler = nc({ onError })

handler.get(async (req, res) => {
  await db.connect()
  const { provinceId } = req.query

  const province = await Province.findById(provinceId)

  let cities = []
  let getCities = []
  let city
  getCities = province.cityId

  for (var i = 0, len = getCities.length; i < len; i++) {
    city = await City.findById(getCities[i])
    cities.push(city)
  }

  await db.disconnect()

  res.send(cities)
})

export default handler
