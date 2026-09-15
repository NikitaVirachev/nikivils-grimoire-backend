import mongoose from 'mongoose';

interface BaseBlock {
  id: string;
}

interface ParagraphBlock extends BaseBlock {
  type: 'paragraph';
  text: string;
}

interface HeadingBlock extends BaseBlock {
  type: 'heading';
  text: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
}

interface ImageBlock extends BaseBlock {
  type: 'image';
  imageId: mongoose.Types.ObjectId;
  alt: string;
  caption: string;
}

interface QuoteBlock extends BaseBlock {
  type: 'quote';
  text: string;
  author: string;
}

export type PostBlock = ParagraphBlock | HeadingBlock | ImageBlock | QuoteBlock;
