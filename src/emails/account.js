const sgMail = require('@sendgrid/mail')

const sendGridAPIKey = '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'

sgMail.setApiKey(sendGridAPIKey)

sgMail.send({
    to: 'rajivpatel16@gmail.com',
    from: 'rajivpatel16@gmail.com',
    subject: 'This is my test email',
    text: 'Hope you are doing well'
}).then(() => {
    console.log('Email sent')
}).catch((error) => {
    console.error(error)
})