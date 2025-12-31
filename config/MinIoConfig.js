import dotenv from 'dotenv'
import * as Minio from 'minio';

dotenv.config()

export const minioClient = new Minio.Client({
  endPoint: 'localhost',
  port: process.env.MINIO_PORT,
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY
});

export const bucketName = process.env.MINIO_BUCKET_NAME;

(async () => {
  const exists = await minioClient.bucketExists(bucketName).catch(() => false);
  if (!exists) {
    await minioClient.makeBucket(bucketName, 'us-east-1');
    console.log(`Bucket '${bucketName}' created`);
  }
})();

