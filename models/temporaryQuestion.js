import mongoose from 'mongoose'
const temporaryQuestionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    text: { type: String, required: true },
    full_text: { type: String, required: true },

    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'question' },
    catId: { type: mongoose.Schema.Types.ObjectId, ref: 'category' },

    status: { type: Boolean, required: true, default: false }
  },
  {
    timestamps: true
  }
)

const TemporaryQuestion =
  mongoose.models.TemporaryQuestion ||
  mongoose.model('TemporaryQuestion', temporaryQuestionSchema)
export default TemporaryQuestion
