import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CryptoModule } from './crypto/crypto.module';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
  imports: [CryptoModule , MongooseModule.forRoot('mongodb://127.0.0.1/crypto')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
