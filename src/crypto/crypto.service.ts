import { Injectable } from '@nestjs/common';
import { Crypto } from './crypto.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as cw from 'crypto-wallets';
import bitcoin from 'bitcoinjs-lib';
import CryptoAccount, { newPrivateKey } from 'send-crypto';
import {
  ECPairInterface,
  ECPairFactory,
  ECPairAPI,
  TinySecp256k1Interface,
  networks,
} from 'ecpair';
import * as tinySecp256k1 from 'tiny-secp256k1';

const tinySecp: TinySecp256k1Interface = tinySecp256k1;
const ECPair: ECPairAPI = ECPairFactory(tinySecp);

@Injectable()
export class CryptoService {
  constructor(@InjectModel(Crypto.name) private cryptoModel: Model<Crypto>) {}

  async createWallet() {
    const privateKey = newPrivateKey();
    console.log(`Save your key somewhere: ${privateKey}`);
    const account = new CryptoAccount(privateKey, { network: 'mainnet' });
    console.log(await account.address('LTC'));
  }

  async sendLtc({ privateKeyWIF, toAddress, amount }) {
    const account = new CryptoAccount(
      '2ecf21d15c432600019afcea973d327c931d21773751caa14b37dfb74e264cdf',
      { network: 'mainnet' },
    );

    console.log(await account.address('LTC'), 'ltc');
    console.log(await account.address('BTC'), 'btc');

    const txHash = await account
      .send('Lh1TPGCPGrqHDnhffNCsFvNtr1UpS7BEBr', 0.01, 'LTC', {
        network: 'mainnet',
      })
      .on('transactionHash', console.log)
      .on('confirmation', console.log);
    console.log(txHash);
  }
}
