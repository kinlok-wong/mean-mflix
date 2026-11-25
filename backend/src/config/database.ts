
import mongoose, { type Connection } from 'mongoose';
import path from 'node:path';
import { existsSync } from 'node:fs';

import { env } from './env';

let appDatabaseConnection: Connection | null = null;

function getMongoConnectionOptions(dbName: string) {
  const certificatePath = path.resolve(
    process.cwd(),
    env.MONGODB_X509_CERT_PATH
  );

  if (!existsSync(certificatePath)) {
    throw new Error(
      `MongoDB certificate not found: ${certificatePath}`
    );
  }

  const certificatePassword =
    env.MONGODB_X509_CERT_PASSWORD;

  return {
    dbName,
    authMechanism: 'MONGODB-X509' as const,
    authSource: '$external',
    tls: true,
    tlsCertificateKeyFile: certificatePath,

    ...(certificatePassword
      ? {
          tlsCertificateKeyFilePassword:
            certificatePassword,
        }
      : {}),

    serverSelectionTimeoutMS: 15000,
    maxPoolSize: 10,
    minPoolSize: 0,
    appName: 'mean-mflix-api',
  };
}

// Existing Movie Database
export async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(
      env.MONGODB_URI,
      getMongoConnectionOptions('sample_mflix')
    );

    console.log(
      'MongoDB Sample Mflix connected successfully'
    );
  } catch (error) {
    console.error('Sample Mflix connection failed');
    throw error;
  }
}

// New Application Database
export async function connectAppDatabase(): Promise<Connection> {
  if (appDatabaseConnection?.readyState === 1) {
    return appDatabaseConnection;
  }

  const connection = mongoose.createConnection(
    env.MONGODB_URI,
    getMongoConnectionOptions('mean_mflix_app')
  );

  try {
    await connection.asPromise();

    appDatabaseConnection = connection;

    console.log(
      'MongoDB Application Database connected successfully'
    );

    return connection;
  } catch (error) {
    console.error('Application Database connection failed');

    await connection.close().catch(() => undefined);

    throw error;
  }
}

export function getAppDatabase(): Connection {
  if (!appDatabaseConnection ||
      appDatabaseConnection.readyState !== 1) {
    throw new Error(
      'Application Database is not connected'
    );
  }

  return appDatabaseConnection;
}

export async function disconnectDatabase(): Promise<void> {
  await Promise.all([
    mongoose.disconnect(),
    appDatabaseConnection?.close(),
  ]);

  appDatabaseConnection = null;

  console.log('MongoDB connections disconnected');
}
