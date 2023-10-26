import { MediaMimeTypesEnum } from './../shared';
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { UploadedFileMetadata } from '@nestjs/azure-storage';
import { MAX_FILE_UPLOAD_SIZE } from './consts';

@Injectable()
export class UploadFileValidatorPipe implements PipeTransform {
  transform(file: UploadedFileMetadata) {
    const mimeType = file.mimetype;
    if (!(Object.values(MediaMimeTypesEnum) as string[]).includes(mimeType.toLowerCase())) throw new BadRequestException('Mime type is not supported');

    if (!file.buffer) throw new BadRequestException('No file attached');

    if (file.buffer?.length === 0) throw new BadRequestException('File cannot be empty');

    if (parseInt(file.size, 10) > MAX_FILE_UPLOAD_SIZE) throw new BadRequestException(`File cannot exceed size of ${MAX_FILE_UPLOAD_SIZE}MB`);

    if (!file.originalname?.split('.')?.[1]) throw new BadRequestException('File should be provided with extension');

    return file;
  }
}
