import mongoose from 'mongoose';

export const connectDatabase = async (uri: string): Promise<void> => {
  await mongoose.connect(uri);

  console.log('MongoDB connected successfully');
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.disconnect();

  console.log('MongoDB disconnected');
};
