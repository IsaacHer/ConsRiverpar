import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'

const r2Client = new S3Client({
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  region: 'auto',
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

export function generateR2Key(projectId: string, fileName: string): string {
  const ext = path.extname(fileName).toLowerCase().replace('.', '')
  const uuid = uuidv4()
  return `projects/${projectId}/${uuid}.${ext}`
}

export async function generatePresignedUrl(r2Key: string, mimeType: string): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: r2Key,
    ContentType: mimeType,
  })
  return getSignedUrl(r2Client, command, { expiresIn: 300 })
}
