import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHome(): string {
    return 'Welcome To API Sendifico! -> Author: Jose Agraz - email: joseagraz29@gmail.com';
  }
}
