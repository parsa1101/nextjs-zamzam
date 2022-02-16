import nc from 'next-connect'
import { onError } from '../../../../utils/error'
import { isAuth } from '../../../../utils/auth'
import db from '../../../../utils/db'
import Favorite from '../../../../models/favorite'

const handler = nc({
  onError
})

handler.use(isAuth)

handler.post(async (req, res) => {
  await db.connect()
  const userId = req.user._id
  const count = await Favorite.count({ userId: userId })
  if (count === 1) {
    try {
      await Favorite.findOneAndUpdate(
        { userId: userId },
        { $push: { questionId: req.body.questionId } },
        { new: true, upsert: true }
      )
    } catch (err) {
      res.status(500).send(err.message)
    }
  } else {
    const newFav = new Favorite({
      ...req.body
    })

    await newFav.save()
  }
  const fav = await Favorite.findOne({ userId: userId })
  const countUserFavorite = fav.questionId.length
  await db.disconnect()
  res.send(countUserFavorite)
})

export default handler
