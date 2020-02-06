const { Kafka, CompressionTypes, logLevel } = require('kafkajs')
const { brokers, clientId } = require('./config')
const { generateEvent } = require('./seeds')

const kafka = new Kafka({
  logLevel: logLevel.DEBUG,
  brokers,
  clientId
})

const topic = 'topic-test'
const producer = kafka.producer()
const randomNumber = () => Math.round(Math.random(10) * 10)

const createMessage = (times) => Array(times)
  .fill()
  .map(generateEvent)
  .map((event) => ({ value: JSON.stringify(event) }))

const logError = (e) => console.error(`[example/producer] ${e.message}`, e)
const logEvent = (e) => console.info('[example/producer] Sending messages: ', e)

const sendMessage = () => {
  const messages = createMessage(randomNumber())

  producer
    .send({
      topic,
      compression: CompressionTypes.GZIP,
      messages
    })
    .then(_ => logEvent(messages))
    .catch(logError)
}

const run = () => (
  producer
    .connect()
    .then(() => setInterval(sendMessage, 3000))
)

run().catch(logError)

const errorTypes = ['unhandledRejection', 'uncaughtException']
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']

errorTypes.map((type) => {
  process.on(type, () => {
    producer
      .disconnect()
      .then(() => process.exit(0))
      .catch(() => process.exit(1))
  })
})

signalTraps.map((type) => {
  process.once(type, () => {
    producer
      .disconnect()
      .finally(() => process.kill(process.pid, type))
  })
})
