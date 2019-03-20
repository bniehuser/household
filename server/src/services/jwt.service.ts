import { Request } from "express";
import { sign, SignOptions, verify, VerifyOptions } from 'jsonwebtoken';
import { Inject, Service } from 'typedi';
import { LogService } from './log.service';
import { FilesystemService } from './filesystem.service';
import { ConfigService } from './config.service';

export interface ITokenData {
    // room to store more stuff here, but for now just a ref to the current login membership
    membershipId: number;
}

@Service('JwtService')
export class JwtService {

    constructor(
        @Inject('ConfigService') private readonly configService: ConfigService,
        @Inject('FilesystemService') private readonly filesystemService: FilesystemService,
        @Inject('LogService') private readonly logService: LogService,
    ) {}

    private _jwtSignOptions: SignOptions = {
        expiresIn: '12h',
        algorithm: 'RS256',
    };
    private _jwtVerifyOptions: VerifyOptions = {
        maxAge: '12h',
        algorithms: ['RS256'],
    };
    private _headerMatch = /^Bearer\s+?(.+?)\s*$/;
    private _privateKey: string;
    private _publicKey: string;

    private get privateKey() {
        if(!this._privateKey) {
            this._privateKey = this.filesystemService.getFileContents(this.configService.get('PRIVATE_KEY_FILE'))
        }
        return this._privateKey;
    }

    private get publicKey() {
        if(!this._publicKey) {
            this._publicKey = this.filesystemService.getFileContents(this.configService.get('PUBLIC_KEY_FILE'))
        }
        return this._publicKey;
    }

    public getDataFromRequest(req: Request): ITokenData {
        return this.getDataFromToken(this.getTokenFromRequest(req));
    }

    public getTokenFromRequest(req: Request): string {
        if (!req.headers || !req.headers.authorization) { return null; }

        const headerMatch = req.headers.authorization.match(this._headerMatch);
        if (!headerMatch) { return null; }

        return headerMatch[1];
    }

    public getDataFromToken(token: string): ITokenData {
        if(!token) { return null; }
        try {
            return verify(token, this.publicKey, this._jwtVerifyOptions) as ITokenData || null;
        } catch (e) {
            this.logService.error(e.toString(), e);
            return null;
        }
    }

    public getTokenFromData(data: ITokenData) {
        return sign(data, this.privateKey, this._jwtSignOptions);
    }
}
