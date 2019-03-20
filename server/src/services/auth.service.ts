import { AuthChecker } from 'type-graphql/dist';
import { IContext } from '../application/types/context';
import { HouseholdMembership, Member } from '../models/household';
import { PermissionType } from '../../../@common/types/permission';
import { Inject, Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { getRepository, Repository } from 'typeorm';
import { JwtService } from './jwt.service';
import { Request } from 'express';
import { LogService } from './log.service';
import bcrypt from 'bcryptjs';

export interface IAuthCredentials {
    email: string;
    password: string;
    householdId?: number;
}

@Service('AuthService')
export class AuthService {

    private memberRepository: Repository<Member>;
    private membershipRepository: Repository<HouseholdMembership>;

    constructor(
        @Inject('LogService') private readonly logService: LogService,
        @Inject('JwtService') private readonly jwtService: JwtService,
    ) {}

    public async authenticate(credentials: IAuthCredentials): Promise<string> {
        if(!this.memberRepository) { this.memberRepository = getRepository(Member); }
        if(!this.membershipRepository) { this.membershipRepository = getRepository(HouseholdMembership); }
        const member = await this.memberRepository.findOne({ email: credentials.email });
        if (member) {
            const passIsOk = await bcrypt.compare(credentials.password, member.password);
            if (passIsOk) {
                let membership: HouseholdMembership;
                if(credentials.householdId !== undefined) {
                    membership = await this.membershipRepository.findOne({member, householdId: credentials.householdId});
                } else {
                    membership = await this.membershipRepository.findOne({member, householdId: null});
                }
                if(!membership) {
                    throw new Error("Invalid household credential for member.");
                }
                return this.jwtService.getTokenFromData({
                    membershipId: membership.id,
                })
            } else {
                throw new Error("Authentication failed.");
            }
        }
    }

    public async getRequestContext(params: {req: Request}): Promise<IContext> {
        if(!this.membershipRepository) { this.membershipRepository = getRepository(HouseholdMembership); }

        const req = params.req;

        const tokenData = this.jwtService.getDataFromRequest(req);

        if (!tokenData || !tokenData.membershipId) {
            return null;
        }

        const membership = await this.membershipRepository.findOne(
            { id: tokenData.membershipId },
            { relations: ['member', 'household'] },
        );

        if(membership === undefined) { return null; }

        this.logService.debug('got context from token', { tokenData, membershipId: membership.id, adminPermission: PermissionType[membership.permissionFor('ADMIN')] });

        return { membership };
    }

    public authChecker: AuthChecker<IContext> = async (
        {context: { membership }},
        roles,
    ) => {
        if(roles) { this.logService.info('checking permission for roles', { roles }); }
        if (!membership) { return false; } // never ok if not member
        if (roles.length === 0) { return true; } // no roles, ok if member

        // super admins can do anything
        if(membership.isSuperAdmin) {
            this.logService.info(`${membership.member.fullName} is a SUPER ADMIN`);
            return true;
        }

        // WARNING, WE USE A SPECIALIZED VERSION OF AUTH ROLES,
        // e.g. @Authorized('ADMIN','WRITE')
        // first param is the feature, second is the access level.  access level is 'READ' if not specified
        let [authKey, authLevel] = roles;
        let authValue: number;
        if(!authLevel) { authLevel = 'READ'; }
        try {
            authValue = (<any>PermissionType)[authLevel]; // get enum index from text name
        } catch(e) {
            this.logService.error('attempted auth on unknown auth level', { authLevel });
        }
        if(authValue === undefined || authValue !== parseInt(<any>authValue, 10)) { return false; }
        if (membership.hasPermission(authKey, authValue)) {
            this.logService.info(`granted permission for ${authKey} / ${authValue} to ${membership.member.fullName}`);
            // grant access if the roles overlap
            return true;
        }

        // no roles matched, restrict access
        return false;
    };
}