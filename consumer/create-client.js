const { Kafka } = require('kafkajs')
const { Observable } = require('rxjs')

const disconnectOnSignals = (consumer) => {
  const SIGNAL_TRAPS = ['SIGTERM', 'SIGINT', 'SIGUSR2']

  SIGNAL_TRAPS.map((type) => {
    process.once(type, () => {
      consumer
        .disconnect()
        .finally(() => process.kill(process.pid, type))
    })
  })
}

const createClient = ({ logLevel, brokers, clientId, topic, groupId }) => {
  const kafkaClient = new Kafka({ logLevel, brokers, clientId })
  const consumer = kafkaClient.consumer({ groupId })

  disconnectOnSignals(consumer)

  return {
    from: (topic) => Observable.create((observer) => (
      consumer
        .connect()
        .then(() => consumer.subscribe({ topic }))
        .then(() => consumer.run({
          eachMessage: ({ message }) => observer.next(message)
        }))
        .catch(observer.error)
    ))
  }
}

module.exports = {
  createClient
}
