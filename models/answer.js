import mongoose from 'mongoose'
const answerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, required: true },
    full_text: { type: String, required: true },
    status: { type: Boolean, required: true, default: false },
    kind: { type: String, required: true, default: 0 },
    media_path: { type: String, required: false },
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' }
  },
  {
    timestamps: true
  }
)

const Answer = mongoose.models.Answer || mongoose.model('Answer', answerSchema)
export default Answer
