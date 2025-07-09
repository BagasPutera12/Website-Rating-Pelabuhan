// src/lib/auth.js
import { NextResponse } from 'next/server';

export function authenticateRequest(request) {
  const apiKey = request.headers.get('x-api-key');

  if (apiKey && apiKey === process.env.API_KEY) {
    // Jika kunci valid, tidak melakukan apa-apa (lanjutkan)
    return true;
  } else {
    // Jika tidak valid, kirim error
    return false;
  }
}