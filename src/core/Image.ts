import sharp from "sharp";

type ImageData = {
  size: number;
  timestamp: number;
  base64ImageData: string;
};

interface Uploader {
  upload(data: ImageData): string;
}

interface Resizer {
  resize(data: ImageData, width: number, height: number): Promise<string> | TypeError;
}

export class ImageUploader<T extends ImageData> implements Uploader {
  upload(data: T): string {
    return data.base64ImageData;
  }
}

export class ImageResizer<T extends ImageData> implements Resizer {
  async resize(data: T, width: number, height: number) {
    const imgBuffer = Buffer.from(data.base64ImageData, "base64");

    try {
      const resized = await sharp(imgBuffer).resize({ width, height }).toBuffer();
      return resized.toString("base64");
    } catch (error) {
      throw TypeError("Incorrect data");
    }
  }
}
