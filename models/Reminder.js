import { Schema, model } from 'mongoose'

const reminderSchema = new Schema({
  content: String,
  date: Date,
  done: Boolean,
  important: Boolean,
  userCreator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

reminderSchema.set('toJSON', {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Reminder = model('Reminder', reminderSchema)

export default Reminder
