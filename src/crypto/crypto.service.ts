import { Injectable } from '@nestjs/common';
import { Crypto } from './crypto.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bitcoin from 'bitcoinjs-lib';
import { ECPairFactory, ECPairAPI, TinySecp256k1Interface } from 'ecpair';
import CryptoAccount from 'send-crypto';
import { Network } from 'ecpair/src/networks';
import * as litecore from 'bitcore-lib-ltc';
import axios from 'axios';
const ecc = require('@bitcoin-js/tiny-secp256k1-asmjs');

const tinysecp: TinySecp256k1Interface = require('tiny-secp256k1');
const ECPair = ECPairFactory(ecc);
// const ECPair: ECPairAPI = ECPairFactory(tinysecp);

const LITECOIN: Network = {
  messagePrefix: '\x19Litecoin Signed Message:\n',
  bech32: 'ltc',
  bip32: {
    public: 0x019da462,
    private: 0x019d9cfe,
  },
  pubKeyHash: 0x30,
  scriptHash: 0x32,
  wif: 0xb0,
};

@Injectable()
export class CryptoService {
  constructor(@InjectModel(Crypto.name) private cryptoModel: Model<Crypto>) {}

  async createLtcWallet() {
    const keyPair = ECPair.makeRandom({ network: LITECOIN });
    const { address } = bitcoin.payments.p2pkh({
      pubkey: keyPair.publicKey,
      network: LITECOIN,
    });

    console.log(keyPair.privateKey.toString('hex'), 'private key');
    console.log(address, 'address');
  }

  async sendLtc({ privateKey, toAddress, amount }) {
    // const test = ECPair.fromWIF(
    //   '341c1e644074b9c9f7ad37828ced4f9224729a0133a39e7a3647bb4e6fc7c03b',
    //   LITECOIN,
    // );

    var privateKey = new litecore.PrivateKey(privateKey);
    var address = privateKey.toAddress();

    const { data } = await axios({
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://ltcbook.nownodes.io/api/v2/utxo/${address}`,
      headers: {
        'api-key': '80fc45eb-808f-4445-b688-e084b99dc08b',
      },
    });
    console.log('**** data', data);
    // const utxo = await new litecore.Transaction.UnspentOutput(data);

    var transaction = await new litecore.Transaction()
      .from(data) // Feed information about what unspent outputs one can use
      .to(toAddress, 5) // Add an output with the given amount of satoshis
      .change(address) // Sets up a change address where the rest of the funds will go
      .sign(privateKey);

    console.log(transaction);
  }
}
