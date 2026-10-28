export type MediaStorageType = 'gridfs' | 's3' | 'r2';

export interface Media {
  id: string;
  storage: MediaStorageType;
  storageKey: string;

  filename: string;
  mimeType: string;
  size: number;

  width: number;
  height: number;
}

export type CreateMediaData = Omit<Media, 'id'>;
