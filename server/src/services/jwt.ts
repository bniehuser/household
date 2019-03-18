import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { sign, SignOptions, verify, VerifyOptions } from 'jsonwebtoken';
import trim from 'lodash/trim';
import { Request } from "express";
import { getRepository } from 'typeorm';
import { Member } from "../models/household/Member";


const jwtSignOptions: SignOptions = {
    expiresIn: '12h',
    algorithm: 'RS256',
};
const jwtVerifyOptions: VerifyOptions = {
    maxAge: '12h',
    algorithms: ['RS256'],
};

const getPrivateKey = () => (
    fs.readFileSync(path.resolve(__dirname, '../../private.key'), 'utf8')
);
const getPublicKey = () => (
    fs.readFileSync(path.resolve(__dirname, '../../public.key'), 'utf8')
);

export interface ILoginCredentials {
    email: string;
    password: string;
}
export interface IApiToken {
    id: string;
}
export const getTokenFromLogin = async (login: ILoginCredentials) => {
    if (!trim(login.email) || !trim(login.password)) {
        return null;
    }
    const memberRepository = getRepository(Member);

    const member = await memberRepository.findOne({ email: login.email }) as Member;
    if (member) {
        const passIsOk = await bcrypt.compare(login.password, member.password);
        if (passIsOk) {
            return sign({ id: member.id }, getPrivateKey(), jwtSignOptions);
        }
    }

    return null;
};

export const getUserFromRequest = async (req: Request) => {
    if (!req.headers.authorization) {
        return null;
    }

    const headerMatch = req.headers.authorization.match(/^Bearer\s+?(.+?)\s*$/);

    if (!headerMatch) {
        return null;
    }

    const token = headerMatch[1];

    let verified: IApiToken|boolean = false;
    try {
        verified = verify(token, getPublicKey(), jwtVerifyOptions) as IApiToken;
    } catch (e) {
        verified = false;
    }

    if (!verified) {
        return null;
    }

    // TODO: get user from db and check all good

    console.log('getUserFromRequest', { verified });

    return {
        id: verified.id,
    };
};
