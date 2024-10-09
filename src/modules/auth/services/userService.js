import { jwtVerify } from 'jose';

export async function getUserProfile(req) {
    const sessionCookie = req.cookies.get('session');

    if (!sessionCookie) {
        return null; 
    }

    const { value } = sessionCookie;
    const secret = new TextEncoder().encode(process.env.AUTH_SECRET);

    try {
        const { payload } = await jwtVerify(value, secret);
        return {  id: payload.sub, idPerfil: payload.idPerfil };
        } catch (error) {
        console.error("Token inválido:", error);
        throw new Error("Token inválido");
    }
}
