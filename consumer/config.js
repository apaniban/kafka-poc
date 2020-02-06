const brokers = [`${process.env.HOST_IP}:9092`]
const clientId = 'example-consumer'
const groupId = 'test-group'

module.exports = {
  brokers,
  clientId,
  groupId
}
