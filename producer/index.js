const { Kafka, CompressionTypes, logLevel } = require('kafkajs')

const host = process.env.HOST_IP

const kafka = new Kafka({
  logLevel: logLevel.DEBUG,
  brokers: [`${host}:9092`],
  clientId: 'example-producer'
})

const topic = 'topic-test'
const producer = kafka.producer()

const getRandomNumber = () => Math.round(Math.random(10) * 1000)
const createMessage = (num) => ({
  key: `key-${num}`,
  value: `value-${num}-${new Date().toISOString()}`
})

const logError = (e) => console.error(`[example/producer] ${e.message}`, e)

const sendMessage = () => (
  producer
    .send({
      topic,
      compression: CompressionTypes.GZIP,
      messages: Array(2)
        .fill()
        .map(() => createMessage(getRandomNumber()))
    })
    .then(console.log)
    .catch(logError)
)

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
