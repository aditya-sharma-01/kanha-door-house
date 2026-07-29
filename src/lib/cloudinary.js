/**
 * Cloudinary Direct Media Upload Helper
 * Uses Web Crypto API (SHA-1) for signed uploads without extra dependencies.
 */

const CLOUDINARY_CLOUD_NAME = 'csfzrbue';
const CLOUDINARY_API_KEY = '627191799699533';
const CLOUDINARY_API_SECRET = 'McZvih5yeJnmkfwjNdiWqqBI8kY';

async function generateSha1(str) {
  const msgBuffer = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function uploadImageToCloudinary(file) {
  if (!file) throw new Error('No image file selected.');

  const timestamp = Math.round(new Date().getTime() / 1000);
  
  // Cloudinary signature string: sorted param_name=param_value& + api_secret
  const stringToSign = `timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
  const signature = await generateSha1(stringToSign);

  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', CLOUDINARY_API_KEY);
  formData.append('timestamp', String(timestamp));
  formData.append('signature', signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (!response.ok || data.error) {
    console.error('Cloudinary error response:', data);
    throw new Error(data.error?.message || 'Failed to upload photo proof to Cloudinary.');
  }

  return data.secure_url;
}
