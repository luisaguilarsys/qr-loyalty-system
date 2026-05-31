import { Injectable } from '@nestjs/common';
import { apiInfo } from './config/api-info';

@Injectable()
export class AppService {
  getHello() {
    return apiInfo;
  }
}
