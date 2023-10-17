import { Injectable } from '@nestjs/common';
import { Crypto } from './crypto.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bitcoin from 'bitcoinjs-lib';
import { ECPairFactory, ECPairAPI, TinySecp256k1Interface } from 'ecpair';
import CryptoAccount from 'send-crypto';
import { Network } from 'ecpair/src/networks';

const tinysecp: TinySecp256k1Interface = require('tiny-secp256k1');
const ECPair: ECPairAPI = ECPairFactory(tinysecp);

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

    console.log(keyPair.privateKey, 'PRIVATE');
    console.log(keyPair.publicKey, 'PUBLIC');
    console.log(address, 'address');
  }

  async sendLtc({ privateKey, toAddress, amount }) {
    ECPair.fromWIF(privateKey, LITECOIN);
    const account = new CryptoAccount(privateKey, { network: 'ltc' });
    console.log(await account.address('LTC'));
  }
}
