import {
  DeployArgs,
  Encoding,
  Field,
  method,
  Permissions,
  Poseidon,
  PrivateKey,
  PublicKey,
  SmartContract,
  State,
  state,
} from 'o1js'

export { Encoding, Field, Poseidon }

// These private keys are exported so that experimenting with the contract is
// easy. Three of them (the Bobs) are used when the contract is deployed to
// generate the public keys that are allowed to post new messages. Jack's key
// is never added to the contract. So he won't be able to add new messages. In
// real life, we would only use the Bobs' public keys to configure the contract,
// and only they would know their private keys.

export const users = {
  Bob: PrivateKey.fromBase58('EKFAdBGSSXrBbaCVqy4YjwWHoGEnsqYRQTqz227Eb5bzMx2bWu3F'),
  SuperBob: PrivateKey.fromBase58('EKEitxmNYYMCyumtKr8xi1yPpY3Bq6RZTEQsozu2gGf44cNxowmg'),
  MegaBob: PrivateKey.fromBase58('EKE9qUDcfqf6Gx9z6CNuuDYPe4XQQPzFBCfduck2X4PeFQJkhXtt'), // This one says duck in it :)
  Jack: PrivateKey.fromBase58('EKFS9v8wxyrrEGfec4HXycCC2nH7xf79PtQorLXXsut9WUrav4Nw'),
}

export class Add extends SmartContract {
  // On-chain state definitions
  @state(Field) message = State<Field>()
  @state(Field) messageHistoryHash = State<Field[]>()
  @state(PublicKey) user1 = State<PublicKey>()
  @state(PublicKey) user2 = State<PublicKey>()
  @state(PublicKey) user3 = State<PublicKey>()

  @method init() {
    // Define initial values of on-chain state
    this.user1.set(users['Bob'].toPublicKey())
    this.user2.set(users['SuperBob'].toPublicKey())
    this.user3.set(users['MegaBob'].toPublicKey())
    this.message.set(Field('Welcome to the chat!'))
    this.messageHistoryHash.set(Encoding.stringToFields(''))
  }

  @method publishMessage(message: Field, signerPrivateKey: PrivateKey) {
    // Compute signerPublicKey from signerPrivateKey argument
    // Get approved public keys
    // Assert that signerPublicKey is one of the approved public keys
    // Update on-chain message variable
    // Computer new messageHistoryHash
    // Update on-chain messageHistoryHash
    signerPrivateKey.toPublicKey().assertEquals(this.user1.get())
    this.message.set(message)
  }
}
