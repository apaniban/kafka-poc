const brokers = [`${process.env.HOST_IP}:9092`]
const clientId = 'example-producer'

module.exports = {
  brokers,
  clientId
}
