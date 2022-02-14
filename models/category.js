import mongoose from 'mongoose'
const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    parrent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
  },
  {
    timestamps: true
  }
)

const Category =
  mongoose.models.Category || mongoose.model('Category', categorySchema)
export default Category
