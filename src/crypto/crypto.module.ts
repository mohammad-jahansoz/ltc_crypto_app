import { Module } from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { CryptoController } from './crypto.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Crypto, CryptoSchema } from './crypto.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Crypto.name, schema: CryptoSchema }]),
  ],
  providers: [CryptoService],
  controllers: [CryptoController],
})
export class CryptoModule {}
