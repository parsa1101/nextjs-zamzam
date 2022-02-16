import nc from 'next-connect'
import { isAdmin, isAuth } from '../../../../utils/auth'
import User from '../../../../models/user'
import Role from '../../../../models/role'
import db from '../../../../utils/db'
import bcrypt from 'bcryptjs'

const handler = nc()
handler.use(isAuth, isAdmin)

handler.get(async (req, res) => {
  await db.connect()
  const user = await User.findById(req.query.id)
  const userRoles = []
  for (var i = 0, len = user.roles.length; i < len; i++) {
    const role = await Role.findById(user.roles[i])
    userRoles.push(role)
  }

  await db.disconnect()

  res.send({ user, userRoles })
})

handler.put(async (req, res) => {
  await db.connect()
  const user = await User.findById(req.query.id)
  const userRoles = []
  req.body.userRoles.map(item => userRoles.push(item._id))
  if (user) {
    user.nameFamily = req.body.nameFamily
    user.email = req.body.email
    user.mobile = req.body.mobile
    user.roles = userRoles
    if (req.body.password) {
      user.password = bcrypt.hashSync(req.body.password)
    }
    await user.save()
    await db.disconnect()
    res.send({ message: 'اطلاعات کاربر با موفقیت ویرایش شد' })
  } else {
    await db.disconnect()
    res.status(404).send({ message: 'کاربر موردنظر یافت نشد' })
  }
})

handler.delete(async (req, res) => {
  await db.connect()
  const user = await User.findById(req.query.id)
  if (user) {
    await user.remove()
    const users = await User.find({}).sort({ createdAt: -1 })

    await db.disconnect()

    res.send(users)
  } else {
    await db.disconnect()
    res.status(404).send({ message: 'کاربر مورد نظر یافت نشد' })
  }
})

export default handler
