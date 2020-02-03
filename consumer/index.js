const { Kafka, logLevel } = require('kafkajs')

const host = process.env.HOST_IP

const kafka = new Kafka({
  logLevel: logLevel.INFO,
  brokers: [`${host}:9092`],
  clientId : 'example-consumer'
})

const topic = 'topic-test'
const consumer = kafka.consumer({ groupId: 'test-group' })

const logError = (e) => console.error(`[example/consumer] ${e.message}`, e)

const run = () => (
  consumer
    .connect()
    .then(() => consumer.subscribe({ topic }))
    .then(() => consumer.run({
      eachMessage: ({ topic, partition, message }) => {
        const prefix = `${topic}[${partition}] | ${message.offset} / ${message.timestamp}`
        console.log(`- ${prefix} ${message.key}#${message.value}`)
      }
    }))
)

run().catch(logError)

const errorTypes = ['unhandledRejection', 'uncaughtException']
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']

errorTypes.map((type) => {
  process.on(type, () => {
    consumer
      .disconnect()
      .then(() => process.exit(0))
      .catch(() => process.exit(1))
  })
})

signalTraps.map((type) => {
  process.once(type, () => {
    consumer
      .disconnect()
      .finally(() => process.kill(process.pid, type))
  })
})
