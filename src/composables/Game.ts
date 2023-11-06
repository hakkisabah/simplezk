import { AccountUpdate, Field, MerkleTree, MerkleWitness, Mina, PrivateKey, UInt32 } from 'o1js'

import { Account, Leaderboard } from './Guess'

export default async () => {
  type Names = 'Bob' | 'Alice' | 'Charlie' | 'Olivia'
  const doProofs = true

  class MyMerkleWitness extends MerkleWitness(8) {}

  const Local = Mina.LocalBlockchain({ proofsEnabled: doProofs })
  Mina.setActiveInstance(Local)
  const initialBalance = 10_000_000_000

  const feePayerKey = Local.testAccounts[0].privateKey
  const feePayer = Local.testAccounts[0].publicKey

  // the zkapp account
  const zkappKey = PrivateKey.random()
  const zkappAddress = zkappKey.toPublicKey()

  // this map serves as our off-chain in-memory storage
  const Accounts: Map<string, Account> = new Map<Names, Account>(
    ['Bob', 'Alice', 'Charlie', 'Olivia'].map((name: string, index: number) => {
      return [
        name as Names,
        new Account({
          publicKey: Local.testAccounts[index].publicKey,
          points: UInt32.from(0),
        }),
      ]
    })
  )

  // we now need "wrap" the Merkle tree around our off-chain storage
  // we initialize a new Merkle Tree with height 8
  const Tree = new MerkleTree(8)
  Tree.setLeaf(0n, Accounts.get('Bob')!.hash())
  Tree.setLeaf(1n, Accounts.get('Alice')!.hash())
  Tree.setLeaf(2n, Accounts.get('Charlie')!.hash())
  Tree.setLeaf(3n, Accounts.get('Olivia')!.hash())

  const initialCommitment: Field = Tree.getRoot()

  const leaderboardZkApp = new Leaderboard(zkappAddress)
  console.log('Deploying leaderboard..')

  if (doProofs) {
    await Leaderboard.compile()
  }

  const tx = await Mina.transaction(feePayer, () => {
    AccountUpdate.fundNewAccount(feePayer).send({
      to: zkappAddress,
      amount: initialBalance,
    })
    leaderboardZkApp.deploy()
    leaderboardZkApp.initState(initialCommitment)
  })
  await tx.prove()
  await tx.sign([feePayerKey, zkappKey]).send()

  console.log('Initial points: ' + Accounts.get('Bob')?.points)
  console.log('Making guess..')
  await makeGuess('Bob', 0n, 22)
  console.log('Final points: ' + Accounts.get('Bob')?.points)

  async function makeGuess(name: Names, index: bigint, guess: number) {
    const account = Accounts.get(name)!

    // Create the witness from for the index from the merkle tree.
    const w = Tree.getWitness(index)
    const witness = new MyMerkleWitness(w)

    // Create a Transaction with guess, account and witness. Send the transaction.
    try {
      const tx = await Mina.transaction(feePayer, () => {
        leaderboardZkApp.guessPreimage(Field(guess), account, witness)
      })
      await tx.prove()
      await tx.sign([feePayerKey, zkappKey]).send()
    } catch (e: any) {
      console.log(e.message)
    }

    // if the transaction was successful, we can update our off-chain storage as well
    account.points = account.points.add(1)
    Tree.setLeaf(index, account.hash())
    leaderboardZkApp.commitment.get().assertEquals(Tree.getRoot())
  }
}
