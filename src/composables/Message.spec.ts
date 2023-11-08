import { Encoding, M, Mina, Poseidon } from './Message'

describe('Message.ts', () => {
  const Local = Mina.LocalBlockchain({
    proofsEnabled: true,
    enforceTransactionLimits: false,
  })
  const [{ publicKey: feePayerAddress }] = Local.testAccounts
  it('Test publish Message', () => {
    const m = new M(feePayerAddress)
    m.init()
    const message = Encoding.stringToFields('Hello')
    const h = Poseidon.hash(message)
    m.publishMessage(h /*, users.Bob*/)
    m.message.fromAppState([h]).equals(h).assertEquals(true)
  })
})
