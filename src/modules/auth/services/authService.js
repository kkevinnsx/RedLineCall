import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

async function openSessionToken(token) {
    const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
    try {
        const { payload } = await jwtVerify(token, secret);
        return payload;
    } catch (error) {
        console.error("Invalid token:", error);
        throw new Error("Token inválido"); 
    }
}

async function createSessionToken(payload = {}) {
    const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
    const session = await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('1d')
        .sign(secret);

    const { exp } = await openSessionToken(session); 

    cookies().set('session', session, {
        expires: new Date(Date.now() + exp * 1000),
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    });

    return session;
}

async function isSessionValid() {
    const sessionCookie = cookies().get('session');

    if (sessionCookie) {
        const { value } = sessionCookie;
        try {
            const { exp } = await openSessionToken(value);
            return Date.now() < exp * 1000;
        } catch (error) {
            console.error("Session validation failed:", error);
            return false; 
        }
    }

    return false;
}

function destroySession(req) {
    try {
        const cookieStore = cookies(); 
        cookieStore.delete('session');
    } catch (error) {
        console.error("Erro ao deletar a sessão:", error);
        throw error; 
    }
}


export { openSessionToken, createSessionToken, isSessionValid, destroySession};
