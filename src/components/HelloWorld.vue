<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <v-img height="300" src="@/assets/logo.svg" />

      <div class="text-body-2 font-weight-light mb-n1">Welcome to</div>

      <h1 class="text-h2 font-weight-bold">Vuetify</h1>

      <div class="py-14" />

      <v-row class="d-flex align-center justify-center">
        <v-col cols="auto">
          <v-btn href="https://vuetifyjs.com/components/all/" min-width="164" rel="noopener noreferrer" target="_blank"
            variant="text">
            <v-icon icon="mdi-view-dashboard" size="large" start />

            Components
          </v-btn>
        </v-col>

        <v-col cols="auto">
          <v-btn color="primary" href="https://vuetifyjs.com/introduction/why-vuetify/#feature-guides" min-width="228"
            rel="noopener noreferrer" size="x-large" target="_blank" variant="flat">
            <v-icon icon="mdi-speedometer" size="large" start />

            Get Started
          </v-btn>
        </v-col>

        <v-col cols="auto">
          <v-btn href="https://community.vuetifyjs.com/" min-width="164" rel="noopener noreferrer" target="_blank"
            variant="text">
            <v-icon icon="mdi-account-group" size="large" start />

            Community
          </v-btn>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script lang="ts" setup>
import { data } from "@/store/testString"

import {
  Bool, Character,
  CircuitString, PrivateKey, Signature
} from "o1js";

// --------------------------------------

// const char1 = Character.fromString('c');
// const char2 = Character.fromString('d');
// const char1EqualsChar2: Bool = char1.equals(char2);

// console.log(`char1: ${char1}`);
// console.log(`char1 === char2: ${char1EqualsChar2.toString()}`);
// console.log(`Fields in char1: ${char1.toFields().length}`);
// console.log('--------------------------------------');

// --------------------------------------

const str1 = CircuitString.fromString(data);
console.log(`str1: ${str1}`);
console.log(`Fields in str1: ${str1.toFields().length}`);

// --------------------------------------

const zkAppPrivateKey = PrivateKey.random();
const zkAppPublicKey = zkAppPrivateKey.toPublicKey();

// const data1 = char2.toFields().concat(signedNumSum.toFields());
const data2 = str1.toFields()//char1.toFields().concat(str1.toFields());

const signature = Signature.create(zkAppPrivateKey, data2);

// const verifiedData1 = signature.verify(zkAppPublicKey, data1).toString();
const verifiedData2 = signature.verify(zkAppPublicKey, data2).toString();

console.log(`private key: ${zkAppPrivateKey.toBase58()}`);
console.log(`public key: ${zkAppPublicKey.toBase58()}`);
console.log(`Fields in private key: ${zkAppPrivateKey.toFields().length}`);
console.log(`Fields in public key: ${zkAppPublicKey.toFields().length}`);

// console.log(`signature verified for data1: ${verifiedData1}`);
console.log(`signature verified for data2: ${verifiedData2}`);

console.log(`Fields in signature: ${signature.toFields().length}`);
console.log('--------------------------------------');

// --------------------------------------

console.log("string size : ", new Blob([data]).size);
</script>
