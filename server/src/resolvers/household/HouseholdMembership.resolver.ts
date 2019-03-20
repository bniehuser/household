import { Arg, Authorized, Ctx, FieldResolver, Mutation, Resolver, Root } from "type-graphql/dist";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Repository, Transaction, TransactionRepository } from "typeorm";
import { Household, HouseholdMembership, Member, PermissionValue, Role } from "../../models/household";
import { MemberInput } from './types/input/MemberInput';
import { IContext } from '../../application/types/context';
import { MemberRepository } from '../../repositories/member.repository';

@Resolver(() => HouseholdMembership)
export class HouseholdMembershipResolver {
    constructor(
        @InjectRepository(HouseholdMembership) private readonly membershipRepository: Repository<HouseholdMembership>,
        @InjectRepository(Household) private readonly householdRepository: Repository<Household>,
        @InjectRepository(Member) private readonly memberRepository: MemberRepository,
        @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    ) {}

    @FieldResolver()
    async household(@Root() membership: HouseholdMembership): Promise<Household> {
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

    @FieldResolver(() => [PermissionValue])
    async permissions(@Root() membership: HouseholdMembership): Promise<PermissionValue[]> {
            return await membership.permissions;
    }

    @Authorized('ADMIN','ADD')
    @Mutation(() => HouseholdMembership)
    @Transaction()
    async addHouseholdMember(
        @Arg("member") memberInput: MemberInput,
        @Arg("householdId") householdId: number,
        @Arg("roleId") roleId: number,
        @Ctx() { membership }: IContext,
        @TransactionRepository() memberRepository: MemberRepository,
        @TransactionRepository(HouseholdMembership) membershipRepository: Repository<HouseholdMembership>,
    ): Promise<HouseholdMembership> {
        let addMember = await memberRepository.findOne({email: memberInput.email});
        if(addMember === undefined) {
            addMember = memberRepository.create({
                ...memberInput,
                createdById: membership.memberId,
            });
            MemberRepository.setPassword(addMember, memberInput.password || 'changeme');
            await memberRepository.save(addMember)
        } else {
            if(memberInput.password !== undefined) {
                // this is stupid; should be done in repository, as part of update
                addMember = MemberRepository.setPassword(addMember, memberInput.password);
                addMember = await memberRepository.save(addMember);
                delete memberInput.password;
            }
            await memberRepository.update(addMember.id, memberInput);
        }
        let newMembership = await membershipRepository.findOne({member: addMember, householdId});
        if(newMembership === undefined) {
            newMembership = await membershipRepository.create({
                member: addMember,
                householdId,
                roleId,
            });
        } else {
            newMembership.roleId = roleId;
        }
        return await membershipRepository.save(newMembership);
    }

    @Authorized(['ADMIN', 'EDIT'])
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