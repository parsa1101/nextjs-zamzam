import nc from 'next-connect'
import Category from '../../../../models/category'
import { isAdmin, isAuth } from '../../../../utils/auth'
import db from '../../../../utils/db'
import { onError } from '../../../../utils/error'

const handler = nc({
  onError
})
handler.use(isAuth, isAdmin)

handler.put(async (req, res) => {
  await db.connect()
  const { id } = req.query

  if (id) {
    if (req.body.parrent_id === '0') {
      await Category.findByIdAndUpdate(id, {
        name: req.body.name,
        $unset: { parrent_id: 1 }
      })
    } else {
      await Category.findByIdAndUpdate(id, {
        name: req.body.name,
        parrent_id: req.body.parrent_id
      })
    }

    await db.disconnect()
    res.send({ message: 'دسته بندی با موفقیت ویرایش شد' })
  } else {
    await db.disconnect()
    res.status(404).send({ message: 'دسته بندی مورد نظر یافت نشد' })
  }
})

handler.delete(async (req, res) => {
  await db.connect()
  const category = await Category.findById(req.query.id)
  if (category) {
    const categories = await Category.find({ parrent_id: category._id })
    for (var i = 0, len = categories.length; i < len; i++) {
      searchInCategory(categories[i]._id)
    }
    await category.remove()
    await db.disconnect()
    res.send('دسته مورد نظر با موفقیت حذف شد')
  } else {
    await db.disconnect()
    res.status(404).send({ message: 'دسته بندی مورد نظر یافت نشد' })
  }
})

export default handler

async function searchInCategory(id) {
  const categories = await Category.find({ parrent_id: id })
  if (categories) {
    for (var i = 0, len = categories.length; i < len; i++) {
      searchInCategory(categories[i]._id)
    }
  }
  await Category.findByIdAndRemove(id)
  return
}
