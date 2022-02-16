import nc from 'next-connect'
import { isAuth, isAdmin } from '../../../../utils/auth'
import db from '../../../../utils/db'
import { onError } from '../../../../utils/error'
import Category from '../../../../models/category'
const handler = nc({
  onError
})
handler.use(isAuth, isAdmin)

handler.post(async (req, res) => {
  await db.connect()

  let newCat
  if (req.body.parrent_id !== '0') {
    newCat = new Category({
      name: req.body.name,
      parrent_id: req.body.parrent_id
    })
  } else {
    newCat = new Category({
      name: req.body.name
    })
  }

  try {
    const cat = await newCat.save()
    await db.disconnect()
    res.send(cat)
  } catch (err) {
    await db.disconnect()
    res.status(401).send({ message: err.message })
  }
})

export default handler
