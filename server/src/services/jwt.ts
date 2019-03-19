import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { sign, SignOptions, verify, VerifyOptions } from 'jsonwebtoken';
import trim from 'lodash/trim';
import { Request, Response } from "express";
import { getRepository } from 'typeorm';
import { Household, Member } from "../models/household";
import { IContext } from '../application/types/context';
import { logger } from './logging';

// TODO: this whole service is a mess.  should be concerned only with the actual trappings of JWT, leave app stuff out

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
    householdId?: number;
}
export interface IApiToken {
    memberId: number;
    householdId?: number;
}
export const getTokenFromLogin = async (login: ILoginCredentials) => {
    if (!trim(login.email) || !trim(login.password)) {
        return null;
    }
    const memberRepository = getRepository(Member);

    // TODO: need to check that member can appropriately access household; no login if not related

    const member = await memberRepository.findOne({ email: login.email }) as Member;
    if (member) {
        const passIsOk = await bcrypt.compare(login.password, member.password);
        if (passIsOk) {
            return sign({ memberId: member.id, householdId: login.householdId }, getPrivateKey(), jwtSignOptions);
        }
    }

    return null;
};

export const getContextFromRequest = async ({req}: {req:Request}): Promise<IContext> => {
    if (!req.headers || !req.headers.authorization) {
        console.log('no auth', Object.keys(req));
        return null;
    }

    const headerMatch = req.headers.authorization.match(/^Bearer\s+?(.+?)\s*$/);

    if (!headerMatch) {
        console.log('no match');
        return null;
    }

    const token = headerMatch[1];

    let verified: IApiToken;
    try {
        verified = verify(token, getPublicKey(), jwtVerifyOptions) as IApiToken;
    } catch (e) {
        logger.error(e.toString(), e);
        return null;
    }

    if (!verified) {
        return null;
    }

    // TODO: get user from db and check all good
    const memberRepository = getRepository(Member);
    const member = await memberRepository.findOne(verified.memberId);

    let household: Household;
    if(verified.householdId) {
        const householdRepository = getRepository(Household);
        household = await householdRepository.findOne(verified.householdId)
    }

    logger.info('getContextFromRequest', { verified });

    return {
        member,
        household,
    };
};
