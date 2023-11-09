import { Encoding, M, Mina, Poseidon } from './Message'

describe('Message.ts', () => {
  const payload = 'Hello'
  const Local = Mina.LocalBlockchain({
    proofsEnabled: true,
    enforceTransactionLimits: false,
  })
  const [{ publicKey: feePayerAddress }] = Local.testAccounts
  it('Match string Fields', () => {
    const m = new M(feePayerAddress)
    m.init()
    const message = Encoding.stringToFields(payload)
    // console.log('to string > ', Encoding.Bijective.Fp.toString(message))
    const h = Poseidon.hash(message)
    expect(Encoding.Bijective.Fp.toString(message)).toMatch(payload)
    m.publishMessage(h /*, users.Bob*/)
    // m.message.fromAppState([h]).assertEquals(h)
  })
})
