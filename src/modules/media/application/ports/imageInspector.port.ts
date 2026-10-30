export interface ImageInfo {
  mimeType: string;
  extension: string;

  width: number;
  height: number;
}

export interface ImageInspector {
  inspect(buffer: Buffer): Promise<ImageInfo>;
}
