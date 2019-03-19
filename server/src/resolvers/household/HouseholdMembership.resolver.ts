import { Arg, Authorized, FieldResolver, Mutation, Resolver, Root } from "type-graphql/dist";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Repository } from "typeorm";
import { Household, HouseholdMembership, Member, PermissionValue, Role } from "../../models/household";

@Resolver(() => HouseholdMembership)
export class HouseholdMembershipResolver {
    constructor(
        @InjectRepository(HouseholdMembership) private readonly membershipRepository: Repository<HouseholdMembership>,
        @InjectRepository(Household) private readonly householdRepository: Repository<Household>,
        @InjectRepository(Member) private readonly memberRepository: Repository<Member>,
        @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    ) {}

    @FieldResolver()
    async household(@Root() membership: HouseholdMembership): Promise<Household> {
        console.log('should be looking up household by id', membership.householdId);
        if(membership.household === undefined) {
            membership.household = await this.householdRepository.findOne(membership.householdId);
        }
        return membership.household;
    }

    @FieldResolver()
    async member(@Root() membership: HouseholdMembership): Promise<Member> {
        if(membership.member === undefined) {
            membership.member = await this.memberRepository.findOne(membership.memberId);
        }
        return membership.member;
    }

    @FieldResolver()
    async role(@Root() membership: HouseholdMembership): Promise<Role> {
        if(membership.role === undefined) {
            membership.role = await this.roleRepository.findOne(membership.roleId);
        }
        return membership.role;
    }

    @FieldResolver(() => String)
    async householdName(@Root() membership: HouseholdMembership): Promise<string> {
        return await this.household(membership).then(h => h.name);
    }

    @FieldResolver(() => String)
    async memberName(@Root() membership: HouseholdMembership): Promise<string> {
        return await this.member(membership).then(m => m.fullName);
    }

    @FieldResolver(() => String)
    async roleName(@Root() membership: HouseholdMembership): Promise<string> {
        return await this.role(membership).then(r => r.name);
    }

    @Authorized(['ADMIN','READ'])
    @FieldResolver(() => [PermissionValue])
    async permissions(@Root() membership: HouseholdMembership): Promise<PermissionValue[]> {
        return await membership.permissions;
    }

    @Mutation(() => HouseholdMembership)
    async changeMembershipRole(@Arg("id") id: number, @Arg('roleId') roleId: number): Promise<HouseholdMembership> {
        const membership = await this.membershipRepository.findOne(id);
        if(membership === undefined) {
            throw new Error(`could not find membership with id ${id}`)
        }
        membership.roleId = roleId;
        return await this.membershipRepository.save(membership);
    }

}