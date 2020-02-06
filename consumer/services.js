const { of } = require('rxjs')
const { delay, tap } = require('rxjs/operators')

const getName = ({ title, firstName, lastName }) => (
  `${title} ${firstName} ${lastName}`
)

// Fake notification service
const sendNotification = ({ passenger }) =>
  of(passenger)
    .pipe(
      tap(() => console.log(`Sending notification to: ${getName(passenger)}`)),
      delay(2000),
      tap(() => console.log('Send successful.'))
    )

module.exports = {
  sendNotification
}
