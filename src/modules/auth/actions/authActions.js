'use server';

import { PrismaClient } from "@prisma/client";
import * as bcrypt from 'bcrypt';
import { redirect } from "next/navigation";
import * as AuthService from "../services/authService";
import {createSessionToken} from "../services/authService";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

async function createAccount(data) {
    const {
        fullName,
        cpf,
        birthDay,
        cep,
        latitude,
        longitude,
        number,
        password,
        email
    } = data;

    if (!password) {
        throw new Error('Password is required');
    }

    const formattedBirthDay = new Date(birthDay).toISOString();

    const hashPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
        data: {
            fullName,
            cpf,
            birthDay: formattedBirthDay,
            cep,
            latitude: null,
            longitude: null,
            number,
            statusChat: false,
            password: hashPassword,
            email,
            idPerfil: 'C',
        },
    });

    redirect('/LogIn');
}

async function loginAcess(data) {
    const { cpf, password } = data;

    const user = await prisma.user.findFirst({
        where: { cpf },
    });

    if (!user) {
        console.log('Usuário não encontrado!');
        throw new Error('Usuário não encontrado!');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        console.log('CPF ou SENHA incorretos!');
        throw new Error('CPF ou SENHA incorretos!');
    }

    await AuthService.createSessionToken({
        sub: user.id,
        idPerfil: user.idPerfil,
        email: user.email,
        cpf: user.cpf
    });

    return { idPerfil: user.idPerfil };
}

async function createPoliceCar(policeData) {
    const {
        cepDP,
        numeroDP,
        numeroViatura,
        modeloViatura,
        placaViatura,
        latitude,
        longitude,
        responsavelId,
    } = policeData;

    await prisma.viatura.create({
        data: {
            cepDP,
            numeroDP,
            numeroViatura,
            modeloViatura,
            placaViatura,
            responsavelId,
            latitude: null,
            longitude: null,
            statusChat: false,
            status: false,
        },
    });
}

export {createAccount, loginAcess, createPoliceCar};