import db from '../../../utils/db'
import nc from 'next-connect'
import User from '../../../models/user'
import bcrypt from 'bcryptjs'
import { signToken } from '../../../utils/auth'
const handler = nc()

handler.post(async (req, res) => {
  await db.connect()

  const user = await User.findOne({ mobile: req.body.mobile })
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    const token = signToken(user)

    const userId = user._id.toString()

    await User.findByIdAndUpdate(userId, { token: token })
    await db.disconnect()
    res.send({
      token,
      _id: user._id,
      email: user.email,
      mobile: user.mobile,
      isAdmin: user.isAdmin
    })
  } else {
    await db.disconnect()
    res
      .status(401)
      .send({ message: 'لطفا مقدار فیلدها را به درستی وارد نمایید' })
  }
})

export default handler
