import mongoose from 'mongoose'
const uiSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    darkMode: { type: Boolean, required: true, default: false }
  },
  {
    timestamps: true
  }
)

const Ui = mongoose.models.Ui || mongoose.model('Ui', uiSchema)
export default Ui
