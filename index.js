import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Reminder from './models/Reminder.js'
import User from './models/User.js'
import sgMail from '@sendgrid/mail'
import twilio from 'twilio'

dotenv.config()
const MONGO_DB_URI = process.env.MONGO_DB_URI
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN
const twilioServiceSid = process.env.TWILIO_SERVICE_SID

const sendGridApiKey = process.env.SENDGRID_API_KEY
const sendGridEmailFrom = process.env.SEND_EMAIL_FROM

const client = twilio(twilioAccountSid, twilioAuthToken)

const sendEmail = async (message, from, to) => {
  sgMail.setApiKey(sendGridApiKey)
  const msg = {
    to,
    from: sendGridEmailFrom,
    subject: `Recordatori de ${from}`,
    text: message,
    html: message
  }
  const res = await sgMail.send(msg)
  console.log(res)
}

const sendSms = async (message, from, to) => {
  const res = await client.messages
    .create({
      body: message + ' de ' + from,
      messagingServiceSid: twilioServiceSid,
      to
    })
  console.log(res)
}

const searchForNotifications = async () => {
  await mongoose.connect(MONGO_DB_URI)
  console.log('Connected to MongoDB')

  const reminders = await Reminder.find({
    done: false,
    date: {
      $lt: new Date(new Date().setHours(23, 59, 59, 999))
    }
  }).populate('user', { email: 1, telephone: 1, name: 1 })
  console.log(reminders)

  reminders.forEach(async reminder => {
    const { content, user } = reminder
    const { name, email, telephone } = user
    if (email) {
      await sendEmail(content, name, email)
    }
    if (telephone) {
      await sendSms(content, name, telephone)
    }
  })
  mongoose.disconnect()
}

searchForNotifications().catch((error) => {
  console.error(error)
})

process.on('uncaughtException', error => {
  console.error(error)
  mongoose.disconnect()
})
