import React from 'react'
import dynamic from 'next/dynamic'
import db from '../../../utils/db'
import User from '../../../models/user'
import Category from '../../../models/category'

const AdminLayout = dynamic(() => import('../../../components/layouts/admin'))
const CreateForm = dynamic(() =>
  import('../../../components/admin/questions/CreateForm')
)

export default function CreatequestionScreen({ userId, token, categories }) {
  return (
    <AdminLayout>
      <CreateForm token={token} userId={userId} categories={categories} />
    </AdminLayout>
  )
}

// export default CreatequestionScreen
// export default dynamic(() => Promise.resolve(CreatequestionScreen), {
//   ssr: false
// })

export async function getServerSideProps(context) {
  const userId = context.req.cookies['userId']
  const token = context.req.cookies['userToken']

  await db.connect()
  const user = await User.findById(userId).lean()
  const categories = await Category.find({}).lean()
  await db.disconnect()

  if (!userId || !user.isAdmin) {
    return {
      redirect: {
        permanent: false,
        destination: '/401'
      },
      props: {}
    }
  }
  return {
    props: {
      userId,
      token,
      categories: categories.map(db.convertCategoryToObj)
    }
  }
}
