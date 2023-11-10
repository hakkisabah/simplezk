import { AccountUpdate, Blog, Field, MerkleTree, Mina, PrivateKey, PublicKey } from './MerkleTree'

const proofsEnabled = false

const UPPER_MAX = 90
const UPPER_LOW = 65

const LOWER_MAX = 122
const LOWER_LOW = 97

const testPayload = 'Hello'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createTree(): any {
  const MT = new MerkleTree(20)
  let currPos = 0
  MT.setLeaf(0n, Field(currPos))
  for (let i = 0; i < testPayload.length; i++) {
    currPos++
    const currChar = testPayload.charCodeAt(i)
    if (currChar >= UPPER_LOW && currChar <= UPPER_MAX) {
      MT.setLeaf(BigInt(currPos), Field(BigInt(currChar)))
    } else if (currChar >= LOWER_LOW && currChar <= LOWER_MAX) {
      MT.setLeaf(BigInt(currPos), Field(BigInt(currChar)))
    }
  }
  return MT
}

describe('MerkleTree.ts', () => {
  let deployerAccount: PublicKey,
    deployerKey: PrivateKey,
    senderAccount: PublicKey,
    senderKey: PrivateKey,
    zkAppAddress: PublicKey,
    zkAppPrivateKey: PrivateKey,
    zkApp: Blog,
    tree: MerkleTree

  beforeEach(() => {
    const Local = Mina.LocalBlockchain({ proofsEnabled })
    Mina.setActiveInstance(Local)
    ;({ privateKey: deployerKey, publicKey: deployerAccount } = Local.testAccounts[0])
    ;({ privateKey: senderKey, publicKey: senderAccount } = Local.testAccounts[1])
    zkAppPrivateKey = PrivateKey.random()
    zkAppAddress = zkAppPrivateKey.toPublicKey()
    zkApp = new Blog(zkAppAddress)
    tree = createTree()
  })
  async function localDeploy() {
    const txn = await Mina.transaction(deployerAccount, () => {
      AccountUpdate.fundNewAccount(deployerAccount)
      zkApp.deploy()
      zkApp.initState(tree.getRoot())
    })
    await txn.prove()
    // this tx needs .sign(), because `deploy()` adds an account update that requires signature authorization
    await txn.sign([deployerKey, zkAppPrivateKey]).send()
  }

  it('generates and deploys the `Add` smart contract', async () => {
    await localDeploy()
    const treeRoot = zkApp.treeRoot.get()
    expect(treeRoot).toEqual(tree.getRoot())
  })

  it('Check tree nodes correction', async () => {
    for (let i = 0; i < testPayload.length; i++) {
      const currChar = +testPayload.charCodeAt(i)
      const leafChar = +tree.getNode(0, BigInt(i + 1)).toString()
      expect(currChar).toEqual(leafChar)
    }
  })
})
