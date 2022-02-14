import mongoose from 'mongoose'
const questionSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    text: { type: String, required: true },
    full_text: { type: String, required: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'question' },
    catId: { type: mongoose.Schema.Types.ObjectId, ref: 'category' },
    pic_path: { type: String, required: true },
    c_count: { type: Number, required: true, default: 0 },
    s_count: { type: Number, required: true, default: 0 },
    status: { type: Boolean, required: true, default: false }
  },
  {
    timestamps: true
  }
)

const Question =
  mongoose.models.Question || mongoose.model('Question', questionSchema)
export default Question
