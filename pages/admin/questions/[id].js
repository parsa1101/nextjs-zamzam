import db from '../../../utils/db'
import Question from '../../../models/question'
import User from '../../../models/user'
import Category from '../../../models/category'
import EditForm from '../../../components/admin/questions/EditForm'
import AdminLayout from '../../../components/layouts/admin'

export default function EditQuestionScreen({ question, categories, token }) {
  return (
    <AdminLayout>
      <EditForm token={token} categories={categories} question={question} />
    </AdminLayout>
  )
}

export async function getServerSideProps(context) {
  const { params } = context
  const { id } = params
  const userId = context.req.cookies['userId']

  const token = context.req.cookies['userToken']

  await db.connect()
  const user = await User.findById(userId).lean()
  const categories = await Category.find({}).lean()

  const question = await Question.findById(id).lean()

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
      question: db.convertDocToObjInTemporaryQuestion(question),
      userId,
      token,
      categories: categories.map(db.convertCategoryToObj)
    }
  }
}

// export default dynamic(() => Promise.resolve(EditQuestionScreen), {
//   ssr: false
// })
