import { Controller, Get } from '@nestjs/common';
import { CryptoService } from './crypto.service';

@Controller('crypto')
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}
  @Get('createWallet')
  createWallet() {
    const walletData = this.cryptoService.createWallet();
    console.log(walletData);
  }
}
