import { Injectable } from '@nestjs/common';
import { Crypto } from './crypto.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as cw from 'crypto-wallets';
import CryptoAccount from 'send-crypto';
import * as crypto from 'crypto';
import {
  ECPairInterface,
  ECPairFactory,
  ECPairAPI,
  TinySecp256k1Interface,
} from 'ecpair';
import * as tinySecp256k1 from 'tiny-secp256k1';
import { Network } from 'ecpair/src/networks';
import * as bitcoinjsLib from 'bitcoinjs-lib';

const tinySecp: TinySecp256k1Interface = tinySecp256k1;
const ECPair: ECPairAPI = ECPairFactory(tinySecp);

@Injectable()
export class CryptoService {
  constructor(@InjectModel(Crypto.name) private cryptoModel: Model<Crypto>) {}

  async createWallet() {
    const ltcWallet = cw.generateWallet('LTC');
    const createdLtcWallet = new this.cryptoModel(ltcWallet);
    return createdLtcWallet.save();
  }
  async sendLtc({ privateKeyWIF, toAddress, amount }) {
    let network: any = {};
    console.log(network);

    const keyPair: ECPairInterface = ECPair.fromWIF(privateKeyWIF);
    const account = new CryptoAccount(keyPair.privateKey);
    console.log(account);

    /* Print address */
    console.log(await account.address('LTC'));

    /* Print balance */
    console.log(await account.getBalance('LTC'));

    const txHash = await account
      .send(toAddress, amount, 'LTC')
      .on('transactionHash', console.log)
      .on('confirmation', console.log);

    console.log(txHash);
  }
}
