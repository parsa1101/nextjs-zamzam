import mongoose from 'mongoose'

const connection = {}
// const { uis } = mongoose.connection.collections;
// uis.drop();
async function connect() {
  if (connection.isConnected) {
    console.log('already connected')
    return
  }
  if (mongoose.connections.length > 0) {
    connection.isConnected = mongoose.connections[0].readyState
    if (connection.isConnected === 1) {
      console.log('use previous connection')
      return
    }
    await mongoose.disconnect()
  }
  const db = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
    // useCreateIndex: true
  })
  console.log('new connection')
  connection.isConnected = db.connections[0].readyState
}

async function disconnect() {
  if (connection.isConnected) {
    // if (process.env.NODE_ENV === 'production') {
    //   await mongoose.disconnect()
    //   connection.isConnected = false
    // } else {
    //   console.log('not disconnected')
    // }
    await mongoose.disconnect()
    connection.isConnected = false
  }
}
function convertDocToObj(doc) {
  doc._id = doc._id.toString()
  doc.userId = doc.userId.toString()
  doc.catId = doc.catId.toString()
  doc.createdAt = doc.createdAt.toString()
  doc.updatedAt = doc.updatedAt.toString()
  return doc
}

function convertCategoryToObj(doc) {
  doc._id = doc._id.toString()
  if (doc.parrent_id) {
    doc.parrent_id = doc.parrent_id.toString()
  }
  doc.createdAt = doc.createdAt.toString()
  doc.updatedAt = doc.updatedAt.toString()
  return doc
}

function convertUserToObj(doc) {
  doc._id = doc._id.toString()
  if (doc.roles) {
    doc.roles.map((item, index) => (doc.roles[index] = item.toString()))
    // doc.roles = doc.roles.toString();
  }
  doc.createdAt = doc.createdAt.toString()
  doc.updatedAt = doc.updatedAt.toString()
  return doc
}

function convertDocToObjINAnswer(doc) {
  doc._id = doc._id.toString()
  doc.questionId = doc.questionId.toString()
  doc.userId = doc.userId.toString()
  if (doc.parentId) {
    doc.parentId = doc.parentId.toString()
  }
  doc.createdAt = doc.createdAt.toString()
  doc.updatedAt = doc.updatedAt.toString()
  return doc
}

function convertDocToObjInTemporaryQuestion(doc) {
  doc._id = doc._id.toString()

  if (doc.userId) {
    doc.userId = doc.userId.toString()
  }
  if (doc.parentId) {
    doc.parentId = doc.parentId.toString()
  }
  if (doc.catId) {
    doc.catId = doc.catId.toString()
  }
  doc.createdAt = doc.createdAt.toString()
  doc.updatedAt = doc.updatedAt.toString()
  return doc
}

function convertOtherToObject(doc) {
  if (doc._id) {
    doc._id = doc._id.toString()
  }

  if (doc.userId) {
    doc.userId = doc.userId.toString()
  }
  if (doc.provinceId) {
    doc.provinceId = doc.provinceId.toString()
  }
  if (doc.cityId) {
    doc.cityId = doc.cityId.toString()
  }
  doc.createdAt = doc.createdAt.toString()
  doc.updatedAt = doc.updatedAt.toString()
  return doc
}

const db = {
  connect,
  disconnect,
  convertDocToObj,
  convertDocToObjINAnswer,
  convertCategoryToObj,
  convertUserToObj,
  convertDocToObjInTemporaryQuestion,
  convertOtherToObject
}
export default db
