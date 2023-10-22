import { Injectable } from '@nestjs/common';
import { Crypto } from './crypto.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bitcoin from 'bitcoinjs-lib';
import { ECPairFactory, ECPairAPI, TinySecp256k1Interface } from 'ecpair';
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

  async sendLtc({ privateKeyWIF, toAddress, amount }) {
    const privateKey = new litecore.PrivateKey(privateKeyWIF);
    const address = privateKey.toAddress();

    const { data } = await axios({
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://ltcbook.nownodes.io/api/v2/utxo/${address}`,
      headers: {
        'api-key': '80fc45eb-808f-4445-b688-e084b99dc08b',
      },
    });

    let utxo = data.pop();
    utxo.address = address.toString();
    utxo.script = new litecore.Script(address).toHex();
    utxo.satoshis = parseInt(utxo.value); // smallest unit
    // utxo.amount = parseInt(utxo.value); // bigest unit

    // const unspentOutput = await new litecore.Transaction.UnspentOutput(utxo);

    const transaction = await new litecore.Transaction()
      .from(utxo) // Feed information about what unspent outputs one can use
      .to([{ address: toAddress, satoshis: amount }]) // work with smallest unit
      // .to(toAddress, 5) // work with biggest price
      .change(toAddress) // Sets up a change address where the rest of the coins
      .fee(1580) // get smallest unit
      .sign(privateKey);

    const serializedTransaction = await transaction.serialize();

    try {
      const result = await axios({
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://ltcbook.nownodes.io/api/v2/sendtx/${serializedTransaction}`,
        headers: {
          'api-key': '80fc45eb-808f-4445-b688-e084b99dc08b',
        },
      });
      console.log({ result: result.data });
    } catch (error) {
      console.log(error);
    }
  }
}
