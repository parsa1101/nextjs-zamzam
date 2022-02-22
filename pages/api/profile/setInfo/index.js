import nc from 'next-connect'
import db from '../../../../utils/db'
import Profile from '../../../../models/profile'
import { onError } from '../../../../utils/error'
import { isAuth } from '../../../../utils/auth'
import User from '../../../../models/user'

const handler = nc({ onError })

handler.use(isAuth)

handler.post(async (req, res) => {
  await db.connect()
  const { userId } = req.body
  try {
    const profile = await Profile.findOne({ userId: userId })

    if (profile) {
      const id = profile._id.toString()
      await Profile.findByIdAndUpdate(id, req.body)
      await User.findByIdAndUpdate(userId, { nameFamily: req.body.nameFamily })
    } else {
      await Profile.insertMany(req.body)
      await User.findByIdAndUpdate(userId, { nameFamily: req.body.nameFamily })
    }
    await db.disconnect()
    res.send({ message: 'addedSuccessfully' })
  } catch (err) {
    await db.disconnect()
    res.status(401).send(err)
  }
})

export default handler
