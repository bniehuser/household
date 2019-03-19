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
                if(credentials.householdId !== undefined) {
                    const membership = this.membershipRepository.find({member, householdId: credentials.householdId});
                    if(!membership) {
                        throw new Error("Invalid household credential for member.");
                    }
                }
                return this.jwtService.getTokenFromData({
                    memberId: member.id,
                    householdId: credentials.householdId,
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

        if (!tokenData) {
            return null;
        }

        let membership: HouseholdMembership;
        if(tokenData.householdId) {
            membership = await this.membershipRepository.findOne(
                { memberId: tokenData.memberId, householdId: tokenData.householdId },
                { relations: ['member', 'household'] },
            );
        } else {
            // find superadmin user permissions if no household
            membership = await this.membershipRepository.findOne(
                { memberId: tokenData.memberId, householdId: null },
                { relations: ['member'] }
            );
        }

        if(membership === undefined) { return null; }

        this.logService.info('got context from token', { tokenData, membershipId: membership.id });

        return { membership };
    }

    public authChecker: AuthChecker<IContext> = async (
        {context: { membership }},
        roles,
    ) => {
        if (!membership) { return false; } // never ok if not member
        if (roles.length === 0) { return true; } // no roles, ok if member

        // super admins can do anything
        if(membership.permissions.some(p => p.key === 'SUPER_ADMIN')) { return true; }

        // WARNING, WE USE A SPECIALIZED VERSION OF AUTH ROLES,
        // e.g. @Authorized('ADMIN','WRITE')
        // first param is the feature, second is the access level.  access level is 'READ' if not specified
        let [authKey, authLevel] = roles;
        let authValue: number;
        if(!authLevel) { authLevel = 'READ'; }
        try {
            authValue = (<any>PermissionType)[authLevel];
        } catch(e) {
            this.logService.error('attempted auth on unknown auth level', { authLevel });
        }
        if(authValue === undefined || authValue !== parseInt(<any>authValue, 10)) { return false; }
        if (membership.permissions.some(permission => permission.key === authKey && permission.value >= authValue)) {
            // grant access if the roles overlap
            return true;
        }

        // no roles matched, restrict access
        return false;
    };
}