import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import path from 'path';
import { Emotion, EmotionTypeEnum } from './dto/emotion.model';
const tesseract = require('node-tesseract-ocr');

@Injectable()
export class AppService {
  directoryPath = 'test2/';
  fileName = 'test';

  limitDirectory = 5;
  config = {
    lang: 'eng',
    oem: 1,
    psm: 3,
  };

  formatFileNames(filesNumer: string): string {
    return this.directoryPath + this.fileName + '-' + filesNumer + '.jpeg';
  }

  blobToFile(buffer: string, fileName: string): void {
    try {
      const length = fs.readdirSync('test2').length;
      const path = this.formatFileNames(length.toString());
      if (length <= this.limitDirectory) {
        fs.appendFile(path, buffer, 'base64', (err: any) => {
          if (err) {
            console.error(err);
            return;
          }

          this.getText(path);
        });
      } else {
      }
    } catch (err: any) {
      console.log(err);
    }
  }

  public async getText(path: string): Promise<string[]> {
    return new Promise(async (resolve, reject) => {
      const text = await tesseract.recognize(path, this.config);
      resolve(text.split('\n'));
    });
  }

  getEmotionMorePresent(arr: string[]) {
    return arr
      .sort(
        (a, b) =>
          arr.filter((v) => v === a).length - arr.filter((v) => v === b).length,
      )
      .pop();
  }

  getEmotion(texts: string[]): Emotion {
    let emotionValue = 0;
    let emotionType = EmotionTypeEnum.neutral;
    try {
      texts.forEach((t: string, index) => {
        if (t !== '') {
          const elemsSplited = t.split('(');
          const value = Number(elemsSplited[1].replace(')', ''));
          const emotion = elemsSplited[0].replace(/ /g, '');
          // TODO verify if the emotion is in the list
          if (
            value != NaN &&
            emotionValue < value &&
            EmotionTypeEnum[emotion]
          ) {
            emotionValue = value;
            emotionType = EmotionTypeEnum[emotion];
          }
        }
      });
    } catch (error) {
      console.log('error', error);
    }

    return { emotionType, emotionValue };
  }

  async getEmotionFeel() {
    const emotionsArray = this.loopOnEmotionFolderAndReturnEmotionArray();
    const morePresentEmotion = this.getEmotionMorePresent(await emotionsArray);

    return morePresentEmotion;
  }

  limitOfFilesPassed(): boolean {
    const length = fs.readdirSync('test2').length;

    return !(length >= this.limitDirectory);
  }

  async loopOnEmotionFolderAndReturnEmotionArray(): Promise<string[]> {
    const emotionsArray = await this.loopOnEmotionFolder();
    return emotionsArray;
  }

  private loopOnEmotionFolder(): Promise<string[]> {
    return new Promise(async (resolve, reject) => {
      fs.readdir(this.directoryPath, async (err, files) => {
        if (err) {
          console.error('Could not list the directory.', err);
          process.exit(1);
        }
        const emotionsArray: string[] = [];

        for (let fileNumber in files) {
          const filePath = this.formatFileNames(fileNumber);
          // Make one pass and make the file complete
          try {
            const texts = await this.getText(filePath);
            const emotion = this.getEmotion(texts);
            emotionsArray.push(emotion.emotionType);
          } catch (error) {
            console.log('error on read file text', error);
          }
          fs.unlink(filePath, (err) => {
            if (err) console.log('error on remove file');
          });
        }
        resolve(emotionsArray);
      });
    });
  }
}
