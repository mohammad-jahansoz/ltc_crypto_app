import { Body, Controller, Get, Post } from '@nestjs/common';
import { CryptoService } from './crypto.service';

@Controller('crypto')
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}

  @Get('create-wallet')
  async createWallet() {
    const walletData = await this.cryptoService.createLtcWallet();
    console.log(walletData);
  }

  @Post('send-ltc')
  async sendLtc(@Body() req: any) {
    const result = await this.cryptoService.sendLtc({
      privateKey: req.privateKey,
      amount: req.amount,
      toAddress: req.toAddress,
    });

    console.log(result);
  }
}
