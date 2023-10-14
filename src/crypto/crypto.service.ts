import { Injectable } from '@nestjs/common';
import { Crypto } from './crypto.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as cw from 'crypto-wallets';

@Injectable()
export class CryptoService {
  constructor(@InjectModel(Crypto.name) private cryptoModel: Model<Crypto>) {}

  async createWallet() {
    const ltcWallet = cw.generateWallet('LTC');
    console.log('Address: ' + ltcWallet.address);
    console.log('Private Key: ' + ltcWallet.privateKey);
    const createdLtcWallet = new this.cryptoModel(ltcWallet);
    return createdLtcWallet.save();
  }
}
