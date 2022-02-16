import Favorite from '../../../models/favorite'
import db from '../../../utils/db'
import nc from 'next-connect'
import { isAuth } from '../../../utils/auth'
import { onError } from '../../../utils/error'

const handler = nc({
  onError
})
handler.use(isAuth)

handler.get(async (req, res) => {
  await db.connect()
  const { insert } = req.query
  const fav = await Favorite.findOne({ userId: insert[0] })
  let count = 0
  if (fav) {
    const countUserFavorite = fav.questionId.length
    for (var i = 0, len = countUserFavorite; i < len; i++) {
      if (fav.questionId[i].toString() === insert[1]) {
        count = 1
      }
    }
  }
  await db.disconnect()
  res.send(count)
})

export default handler
