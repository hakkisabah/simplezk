<template>
  <div>Vue and TDD</div>
</template>

<script lang="ts">
import { CircuitString, PrivateKey, Signature } from 'o1js'

// --------------------------------------

// const char1 = Character.fromString('c');
// const char2 = Character.fromString('d');
// const char1EqualsChar2: Bool = char1.equals(char2);

// console.log(`char1: ${char1}`);
// console.log(`char1 === char2: ${char1EqualsChar2.toString()}`);
// console.log(`Fields in char1: ${char1.toFields().length}`);
// console.log('--------------------------------------');

// --------------------------------------
const data =
  'c3b6fc33126b143f5da16825c9de40187ba3e17ee988ee334a62fec27ca956c3sadsdasdas62fec27ca956c3sadsdasdas27ca956c3sadsdasdas3sadsdasdas'

const str1 = CircuitString.fromString(data)
console.log(`str1: ${str1}`)
console.log(`Fields in str1: ${str1.toFields().length}`)

// --------------------------------------

const zkAppPrivateKey = PrivateKey.random()
const zkAppPublicKey = zkAppPrivateKey.toPublicKey()

// const data1 = char2.toFields().concat(signedNumSum.toFields());
const data2 = str1.toFields() //char1.toFields().concat(str1.toFields());

const signature = Signature.create(zkAppPrivateKey, data2)

// const verifiedData1 = signature.verify(zkAppPublicKey, data1).toString();
const verifiedData2 = signature.verify(zkAppPublicKey, data2).toString()

console.log(`private key: ${zkAppPrivateKey.toBase58()}`)
console.log(`public key: ${zkAppPublicKey.toBase58()}`)
console.log(`Fields in private key: ${zkAppPrivateKey.toFields().length}`)
console.log(`Fields in public key: ${zkAppPublicKey.toFields().length}`)

// console.log(`signature verified for data1: ${verifiedData1}`);
console.log(`signature verified for data2: ${verifiedData2}`)

console.log(`Fields in signature: ${signature.toFields().length}`)
console.log('--------------------------------------')

// --------------------------------------

console.log('string size : ', new Blob([data]).size)
</script>
