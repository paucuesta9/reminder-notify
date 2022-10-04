import { Schema, model } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const userSchema = new Schema({
  username: {
    type: String,
    unique: true
  },
  name: String,
  passwordHash: String,
  email: String,
  telephone: String,
  createdReminders: [{
    type: Schema.Types.ObjectId,
    ref: 'Reminder'
  }],
  reminders: [{
    type: Schema.Types.ObjectId,
    ref: 'Reminder'
  }]
})

userSchema.set('toJSON', {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v

    delete returnedObject.passwordHash
  }
})

userSchema.plugin(uniqueValidator)

const User = model('User', userSchema)

export default User
