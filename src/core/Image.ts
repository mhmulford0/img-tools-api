import sharp from "sharp";

type ImageData = {
  timestamp: number;
  base64ImageData: string;
};

interface Resizer {
  resize(data: ImageData, width: number, height: number): Promise<string> | TypeError;
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
