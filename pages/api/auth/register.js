import db from '../../../utils/db'
import nc from 'next-connect'
import User from '../../../models/user'
import bcrypt from 'bcryptjs'
import { signToken } from '../../../utils/auth'
const handler = nc()

handler.post(async (req, res) => {
  await db.connect()

  const { email, mobile, password } = req.body

  const checkEmail = await User.findOne({ email: email })
  if (checkEmail) {
    await db.disconnect()
    res.status(401).send({ message: 'ایمیل وارد شده تکراری است' })
  }

  const checkMobile = await User.findOne({ mobile: mobile })
  if (checkMobile) {
    await db.disconnect()
    res.status(401).send({ message: 'تلفن همراه وارد شده تکراری است' })
  }

  const newUser = new User({
    email: email,
    mobile: mobile,
    password: bcrypt.hashSync(password)
  })

  try {
    const user = await newUser.save()

    const token = signToken(user)

    const userId = user._id.toString()

    await User.findByIdAndUpdate(userId, { token: token })

    res.send({
      token,
      _id: user._id,
      email: user.email,
      mobile: user.mobile,
      isAdmin: user.isAdmin
    })

    await db.disconnect()
  } catch (err) {
    await db.disconnect()
    res.status(401).send({ message: err.message })
  }
})

export default handler
