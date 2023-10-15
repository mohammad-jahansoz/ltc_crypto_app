import { Injectable } from '@nestjs/common';
import { Crypto } from './crypto.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import bitcoin from 'bitcoinjs-lib';
import { ECPairFactory, ECPairAPI, TinySecp256k1Interface } from 'ecpair';
// const tinysecp: TinySecp256k1Interface = require('tiny-secp256k1');
import tinysecp from 'tiny-secp256k1';
const tinySecp256k1Interface: TinySecp256k1Interface = tinysecp;

const ECPair: ECPairAPI = ECPairFactory(tinySecp256k1Interface);

@Injectable()
export class CryptoService {
  constructor(@InjectModel(Crypto.name) private cryptoModel: Model<Crypto>) {}

  async createLtcWallet() {
    const keyPair = ECPair.makeRandom();
    console.log(keyPair);
  }

  async sendLtc({ privateKeyWIF, toAddress, amount }) {}
}
