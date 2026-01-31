import { Injectable } from "@nestjs/common";

@Injectable()
export class FileService {
  bufferToBase64(buffer: Buffer) {
    // encoding a file to base64 string
    return buffer.toString("base64");
  }

  // decode base64 string to file buffer
  base64ToBuffer(base64String: string) {
    return Buffer.from(base64String, "base64");
  }
}
