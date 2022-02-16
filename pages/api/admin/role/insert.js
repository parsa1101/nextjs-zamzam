import nc from 'next-connect'
import { onError } from '../../../../utils/error'
import { isAdmin, isAuth } from '../../../../utils/auth'
import db from '../../../../utils/db'
import Role from '../../../../models/role'
const handler = nc({
  onError
})
handler.use(isAuth, isAdmin)

handler.post(async (req, res) => {
  await db.connect()
  const { _id, name, permissions } = req.body

  let role

  if (_id) {
    try {
      const preRole = await Role.findById(_id)

      //check permision
      let equal = false
      if (preRole) {
        const roles = await Role.find({})
        for (let i = 0, len = roles.length; i < len; i++) {
          const per = [...roles[i].permissions]
          for (let j = 0, len = per.length; j < len; j++) {
            if (per[j] === permissions[0]) {
              equal = true
            }
          }
        }
        if (equal) {
          await db.disconnect()
          res.status(401).send({ message: 'مجوز دسترسی وارد شده تکراری است' })
        } else {
          role = await Role.findByIdAndUpdate(
            preRole._id,
            { $push: { permissions: permissions[0] } },
            { new: true, upsert: true }
          )
          await db.disconnect()
          res.send(role)
        }
      } else {
        await db.disconnect()
        res.status(401).send({ message: 'نقش مورد نظر یافت نشد!' })
      }
    } catch (err) {
      await db.disconnect()
      res.status(401).send({ message: err.message })
    }
  } else {
    const preRole = await Role.findOne({ name: name })
    if (preRole) {
      await db.disconnect()
      res.status(401).send({ message: ' نام وارد شده تکراری است' })
    }
    const roles = await Role.find({})
    //check permision not repeated
    let equal = false
    for (let i = 0, len = roles.length; i < len; i++) {
      const per = [...roles[i].permissions]
      for (let j = 0, len = per.length; j < len; j++) {
        if (per[j] === permissions[0]) {
          equal = true
        }
      }
    }
    if (equal) {
      await db.disconnect()
      res.status(401).send({ message: 'مجوز دسترسی وارد شده تکراری است' })
    } else {
      try {
        role = new Role({
          name: name,
          permissions: permissions
        })
        role = await role.save()

        await db.disconnect()
        res.send(role)
      } catch (err) {
        await db.disconnect()
        res.status(401).send({ message: err.message })
      }
    }
  }
})

export default handler
