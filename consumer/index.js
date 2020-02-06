const { logLevel } = require('kafkajs')
const { of, throwError, timer } = require('rxjs')
const { filter, map, tap, mergeMap } = require('rxjs/operators')
const { createClient } = require('./create-client')
const { sendNotification } = require('./services')
const { brokers, clientId, groupId } = require('./config')

const client = createClient({
  logLevel: logLevel.INFO,
  brokers,
  clientId,
  groupId
})

const parseValue = ({ value }) => {
  try {
    return of(JSON.parse(value))
  } catch(error) {
    return throwError(error)
  }
}

const consumer = client
  .from('topic-test')
  .pipe(
    mergeMap(parseValue),
    filter(({ port }) => port === 'ADELAIDE'),
    mergeMap(sendNotification)
  )

consumer.subscribe(console.log, console.error)
