import { SignJWT, jwtVerify } from 'jose';

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

export async function encryptMessage(content: string): Promise<string> {
  return new SignJWT({ content })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .sign(secretKey);
}

export async function decryptMessage(token: string): Promise<string> {
  const { payload } = await jwtVerify(token, secretKey);
  return payload.content as string;
}