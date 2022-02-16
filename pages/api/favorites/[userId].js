import Favorite from '../../../models/favorite'
import db from '../../../utils/db'
import nc from 'next-connect'

const handler = nc()

handler.get(async (req, res) => {
  const { userId } = req.query

  await db.connect()

  const fav = await Favorite.findOne({ userId: userId })
  let count = 0
  if (fav) {
    count = fav.questionId.length
  }

  await db.disconnect()
  res.send(count)
})

export default handler
