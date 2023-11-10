import {
  AccountUpdate,
  CircuitString,
  DeployArgs,
  Encoding,
  Encryption,
  fetchAccount,
  Field,
  MerkleTree,
  MerkleWitness,
  method,
  Mina,
  Permissions,
  Poseidon,
  PrivateKey,
  PublicKey,
  SmartContract,
  State,
  state,
} from 'o1js'

export { AccountUpdate, Field, MerkleTree, Mina, PrivateKey, PublicKey }

export class MerkleWitness20 extends MerkleWitness(20) {}

export class Blog extends SmartContract {
  // On-chain state definitions
  @state(Field) treeRoot = State<Field>()

  @method initState(initialRoot: Field) {
    // Define initial values of on-chain state
    this.treeRoot.set(initialRoot)
  }

  @method update(leafWitness: MerkleWitness20) {}
}
