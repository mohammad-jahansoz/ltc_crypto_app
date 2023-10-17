import { Injectable } from '@nestjs/common';
import { Crypto } from './crypto.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bitcoin from 'bitcoinjs-lib';
import { ECPairFactory, ECPairAPI, TinySecp256k1Interface } from 'ecpair';
import CryptoAccount from 'send-crypto';
import { Network } from 'ecpair/src/networks';
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
    // try {
    //   const test = ECPair.fromWIF(
    //     '341c1e644074b9c9f7ad37828ced4f9224729a0133a39e7a3647bb4e6fc7c03b',
    //     LITECOIN,
    //   );
    //   console.log(test);
    // } catch (err) {
    //   console.log(err);
    // }
    const account = new CryptoAccount(privateKey, { network: 'LTC' });
    console.log(account);
    // console.log(await account.address('LTC'));
    // const txHash = await account
    //   .send(toAddress, amount, 'LTC')
    //   .on('transactionHash', console.log)
    //   .on('confirmation', console.log);
  }
}
