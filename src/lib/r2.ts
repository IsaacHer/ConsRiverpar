import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'

const accountId = process.env.R2_ACCOUNT_ID
const accessKeyId = process.env.R2_ACCESS_KEY_ID
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY
const bucketName = process.env.R2_BUCKET_NAME

if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
  console.warn(
    '[r2] Variables de entorno de Cloudflare R2 no configuradas. ' +
    'La subida de imágenes no funcionará hasta configurar ' +
    'R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY y R2_BUCKET_NAME'
  )
}

const r2Client = new S3Client({
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  region: 'auto',
  credentials: {
    accessKeyId: accessKeyId ?? '',
    secretAccessKey: secretAccessKey ?? '',
  },
})

export function generateR2Key(projectId: string, fileName: string): string {
  const ext = path.extname(fileName).toLowerCase().replace('.', '')
  const uuid = uuidv4()
  return `projects/${projectId}/${uuid}.${ext}`
}

export async function generatePresignedUrl(r2Key: string, mimeType: string): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: bucketName ?? '',
    Key: r2Key,
    ContentType: mimeType,
  })
  return getSignedUrl(r2Client, command, { expiresIn: 300 })
}

export async function deleteFromR2(r2Key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: bucketName ?? '',
    Key: r2Key,
  })
  await r2Client.send(command)
}
