import nc from 'next-connect'
import Category from '../../../models/category'

import db from '../../../utils/db'
import { onError } from '../../../utils/error'

const handler = nc({
  onError
})

// let menuItems = []

handler.get(async (req, res) => {
  await db.connect()

  const cats = await Category.find({ parrent_id: null })
  const arr = []
  let hasChild = false
  for (var i = 0, len = cats.length; i < len; i++) {
    const childs = await Category.find({ parrent_id: cats[i]._id })
    if (childs && childs.length > 0) {
      hasChild = true
    } else {
      hasChild = false
    }
    arr.push({
      _id: cats[i]._id.toString(),
      name: cats[i].name,
      hasChild: hasChild
    })
  }
  // for (var i = 0, len = cats.length; i < len; i++) {
  //   const childs = await Category.find({ parrent_id: cats[i]._id })
  //   if (childs.length > 0) {
  //     item = {
  //       _id: cats[i]._id,
  //       label: cats[i].name,
  //       to: `/path/${cats[i]._id}`
  //     }
  //     getChilds(item, childs)
  //   } else {
  //     item = {
  //       _id: cats[i]._id,
  //       label: cats[i].name,
  //       to: `/path/${cats[i]._id}`
  //     }
  //     menuItems.push(item)
  //   }
  // }
  await db.disconnect()
  // for (var i2 = 0, len2 = menuItems.length; i2 < len2; i2++) {
  //   console.log(menuItems[i2])
  // }

  res.send(arr)
})

export default handler

// const getChilds = async (item, childs) => {
//   let childrenArr = []
//   for (var i = 0, len = childs.length; i < len; i++) {
//     const findCat = await Category.findById(childs[i]._id)

//     childrenArr.push({
//       _id: findCat._id,
//       lable: findCat.name,
//       to: `/path/${findCat._id}`
//     })
//     item = { ...item, children: childrenArr }
//     menuItems.push(item)
//   }
//   for (var j = 0, le = menuItems.length; j < le; j++) {
//     if (menuItems[j].children) {
//       const ch = [...menuItems[j].children]

//       if (ch) {
//         updateChild(j, ch)
//       }
//     }
//   }
// }

// const updateChild = async (j, ch) => {
//   const childArr = []
//   let value
//   let newCh
//   for (var k = 0, le = ch.length; k < le; k++) {
//     const cat = await Category.find({ parrent_id: ch[k]._id })
//     if (cat.length > 0) {
//       for (var m = 0, lem = cat.length; m < lem; m++) {
//         value = { _id: cat[m]._id, lable: cat[m].name }
//         childArr.push(value)
//       }
//       let temp_element = { ...ch[k] }
//       temp_element = { ...temp_element, children: childArr }
//       newCh = [...ch]
//       newCh[k] = temp_element
//     }
//   }
//   const temp_menu = [...menuItems]
//   temp_menu[j] = { ...temp_menu[j], children: newCh }
//   menuItems = [...temp_menu]
// }
