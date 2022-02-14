import mongoose from 'mongoose'
const temporaryAnswerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, required: true },
    full_text: { type: String },
    status: { type: Boolean, required: true, default: false },
    kind: { type: String, required: true, default: 0 },
    mediaPath: { type: String },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TemporaryQuestion'
    }
  },
  {
    timestamps: true
  }
)

const TemporaryAnswer =
  mongoose.models.TemporaryAnswer ||
  mongoose.model('TemporaryAnswer', temporaryAnswerSchema)
export default TemporaryAnswer
