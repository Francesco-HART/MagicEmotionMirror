import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('file')
  writeFile(@Body() dto: { base64Canvas: string }): void {
    return this.appService.blobToFile(dto.base64Canvas, 'test');
  }

  @Get('emotion')
  async getEmotion(): Promise<string> {
    try {
      return await this.appService.getEmotionFeel();
    } catch (error) {
      console.log('error');
    }
  }

  @Get('limit')
  canSendFile(): boolean {
    return this.appService.limitOfFilesPassed();
  }
}
