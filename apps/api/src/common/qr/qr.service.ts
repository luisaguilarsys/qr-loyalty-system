import { Injectable } from '@nestjs/common';
import * as QrCode from 'qrcode'

export interface QrPayload {
  v: number;
  token: string;
}

@Injectable()
export class QrService {

  async generateQrBuffer(payload: QrPayload): Promise<Buffer>{
    const content = JSON.stringify(payload);
    
    return QrCode.toBuffer(content,{
      errorCorrectionLevel:'M',
      type:'png',
      margin:2,
      width:300
    })

  }

  async generateQrDataUrl(payload:QrPayload):Promise<string>{
    const content = JSON.stringify(payload);

    return QrCode.toDataURL(content,{
      errorCorrectionLevel:'M',
      margin:2,
      width:300
    })
  }

  parseQrContent(raw:string):QrPayload | null{
    try{
      const parsed = JSON.parse(raw);
      if(parsed.v && parsed.token) return parsed as QrPayload;
      return null
    }catch{
      return null;
    }
  }


}
