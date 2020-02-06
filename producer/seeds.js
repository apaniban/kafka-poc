const faker = require('faker')

const PORTS = ['ADELAIDE', 'MELBOURNE', 'SYDNEY', 'PERTH']
const BAGGAGE_EVENT = 'BAGGAGE_EVENT'

const generateEvent = () => ({
  eventType: BAGGAGE_EVENT,
  port: faker.helpers.randomize(PORTS),
  passenger: {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    title: faker.name.prefix()
  },
  baggage: {
    reference: faker.random.uuid(),
  }
})

module.exports = {
  generateEvent
}
