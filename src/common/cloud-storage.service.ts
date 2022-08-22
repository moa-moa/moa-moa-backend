import { Bucket, Storage } from '@google-cloud/storage';
import { BadRequestException, Injectable } from '@nestjs/common';
import { parse } from 'path';
import { File } from './file.interface';

@Injectable()
export class CloudStorageService {
  private bucket: Bucket;
  private storage: Storage;

  constructor() {
    this.storage = new Storage({
      projectId: process.env.PROJECT_ID,
      credentials: {
        client_email: process.env.CLIENT_EMAIL,
        private_key: process.env.PRIVATE_KEY,
      },
    });

    this.bucket = this.storage.bucket('moamoa-cdn-bucket');
  }

  private setDestination(destination: string): string {
    let escDestination = '';
    escDestination += destination
      .replace(/^\.+/g, '')
      .replace(/^\/+|\/+$/g, '');
    if (escDestination !== '') escDestination = escDestination + '/';
    return escDestination;
  }

  private setFilename(uploadedFile: File): string {
   const fileName = parse(uploadedFile.originalname);
    return `${fileName.name}-${Date.now()}${fileName.ext}`
      .replace(/^\.+/g, '')
      .replace(/^\/+/g, '')
      .replace(/\r|\n/g, '_');
  }

  async uploadFile(uploadedFile: File, destination: string): Promise<any> {
    const fileName =
      this.setDestination(destination) + this.setFilename(uploadedFile);
    const file = this.bucket.file(fileName);
    try {
      await file.save(uploadedFile.buffer, {
        contentType: uploadedFile.mimetype,
      });
    } catch (error: any) {
      throw new BadRequestException(error?.message);
    }
    return {
      ...file.metadata,
      publicUrl: `https://storage.googleapis.com/${this.bucket.name}/${file.name}`,
    };
  }

  async removeFile(fileName: string): Promise<void> {
    const file = this.bucket.file(fileName);
    try {
      await file.delete();
    } catch (error: any) {
      throw new BadRequestException(error?.message);
    }
  }
}
