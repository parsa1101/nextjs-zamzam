import mongoose from 'mongoose'
const favoriteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    questionId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }]
  },
  {
    timestamps: true
  }
)

const Favorite =
  mongoose.models.Favorite || mongoose.model('Favorite', favoriteSchema)
export default Favorite
