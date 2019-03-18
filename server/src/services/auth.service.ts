import { AuthChecker } from 'type-graphql/dist';
import { IContext } from '../application/types/context';
import { getRepository } from 'typeorm';
import { HouseholdMembership } from '../models/household';
import { PermissionType } from '@common/types/permission';
import { logger } from './logging';

export class AuthService {


    static authChecker: AuthChecker<IContext> = async (
        {context: {member, household}},
        roles,
    ) => {
        if (!member) { return false; } // never ok if not member
        if (roles.length === 0) { return true; } // no roles, ok if member

        // find membership
        // TODO: inject repositories; recreating each request is wasteful
        const membershipRepository = getRepository(HouseholdMembership);
        let membership: HouseholdMembership;

        // get household membership permissions if needed
        if(household) {
            membership = await membershipRepository.findOne({member, household});
        } else {
            // find superadmin user permissions if no household
            membership = await membershipRepository.findOne({member, householdId: null});
        }

        if(!membership) { return false; }

        // WARNING, WE USE A SPECIALIZED VERSION OF AUTH ROLES,
        // e.g. @Authorized('ADMIN','WRITE')
        // first param is the feature, second is the access level.  access level is 'READ' if not specified
        let [authKey, authLevel] = roles;
        let authValue: number;
        if(!authLevel) { authLevel = 'READ'; }
        try {
            const authValue: number = (<any>PermissionType)[authLevel];
        } catch(e) {
            logger.error('attempted auth on unknown auth level', { authLevel });
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