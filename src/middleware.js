import { NextRequest, NextResponse } from "next/server";
import { isSessionValid } from './modules/auth/services/authService'
import { getUserProfile } from './modules/auth/services/userService'

export const config = {
    matcher: '/((?!_next/static|_next/image|favicon.ico|/api/).*)', 
};

const publicRoutes = [
    '/',
    '/SignIn',
    '/LogIn',
    '/401',
    '/api/logout',
    '/api/policeList',
];

const restrictedRoutes = {
    'A': ['/admControl', '/admCrud'],
    'B': ['/policeHomePage', '/policeCalls', '/policeSettings', '/api/startVigilance', '/api/getUsersLocation', '/socket.io', '/api/socket', '/api/cancelOcorrence', '/api/updateRoute'],
    'C': ['/HomePage', '/Calls', '/Settings', '/api/userActiveSOS', '/api/updateLocation', '/api/getUsersLocation', '/api/getVehicles', '/api/socket', '/api/sosButton', '/api/updateUserStatus', '/socket.io']
};

export async function middleware(req) {
    const pathname = req.nextUrl.pathname;

    if (publicRoutes.includes(pathname)) {
        return NextResponse.next();
    }

    const sessionValid = await isSessionValid(req);
    if (!sessionValid) {
        console.warn(`Sessão inválida, redirecionando para LogIn.`);
        return NextResponse.redirect(new URL('/LogIn', req.url));
    }

    let userProfile;
    try {
        userProfile = await getUserProfile(req);
    } catch (error) {
        console.error("Erro ao obter perfil do usuário:", error);
        return NextResponse.redirect(new URL('/401', req.url));
    }
    
    if (!userProfile || !userProfile.idPerfil) {
        console.warn(`Perfil do usuário não encontrado, redirecionando para 401.`);
        return NextResponse.redirect(new URL('/401', req.url));
    }

    const allowedRoutes = restrictedRoutes[userProfile.idPerfil] || [];
    
    if (!allowedRoutes.includes(pathname)) {
        console.warn(`Acesso negado para o perfil '${userProfile}' à rota '${pathname}'`);
        return NextResponse.redirect(new URL('/401', req.url));
    }

    const res = NextResponse.next();

    res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.headers.set('Expires', '0');
    res.headers.set('Surrogate-Control', 'no-store');

    return res;
}
