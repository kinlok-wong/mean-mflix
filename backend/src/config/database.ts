
import mongoose from 'mongoose';
import path from 'node:path';
import { existsSync } from 'node:fs';

export async function connectDatabase(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  const certificatePath = process.env.MONGODB_X509_CERT_PATH;

  if (!uri) {
    throw new Error('MONGODB_URI is not configured');
  }

  if (!certificatePath) {
    throw new Error(
      'MONGODB_X509_CERT_PATH is not configured'
    );
  }

  const resolvedCertificatePath = path.resolve(
    process.cwd(),
    certificatePath
  );

  if (!existsSync(resolvedCertificatePath)) {
    throw new Error(
      `MongoDB certificate not found: ${resolvedCertificatePath}`
    );
  }

  const certificatePassword =
    process.env.MONGODB_X509_CERT_PASSWORD;

  try {
    await mongoose.connect(uri, {
        // Explicitly select Sample Mflix
      dbName: 'sample_mflix',
      authMechanism: 'MONGODB-X509',
      authSource: '$external',

      tls: true,
      tlsCertificateKeyFile: resolvedCertificatePath,

      ...(certificatePassword
        ? {
            tlsCertificateKeyFilePassword:
              certificatePassword
          }
        : {}),

      serverSelectionTimeoutMS: 15000,
      maxPoolSize: 10,
      minPoolSize: 0,

      appName: 'mean-mflix-api'
    });

    console.log('MongoDB Atlas connected successfully');

  } catch (error) {
    console.error('MongoDB connection failed');

    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();

  console.log('MongoDB disconnected');
}
