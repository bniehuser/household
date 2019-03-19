import { HouseholdMembership, Member } from "../../models/household";
import { Arg, Authorized, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from "type-graphql/dist";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Context } from "vm";
import { MemberInput } from "./types/input/MemberInput";
import bcrypt from 'bcryptjs';


@Resolver(() => Member)
export class MemberResolver {
    constructor(
        @InjectRepository(Member) private readonly memberRepository: Repository<Member>,
        @InjectRepository(HouseholdMembership) private readonly membershipRepository: Repository<HouseholdMembership>,
    ) {}

    @Authorized()
    @Query(() => [Member])
    members(): Promise<Member[]> {
        return this.memberRepository.find({ relations: ['memberships', 'memberships.household']});
    }

    @FieldResolver()
    async memberships(@Root() member: Member): Promise<HouseholdMembership[]> {
        if(member.memberships === undefined) {
            member.memberships = await this.membershipRepository.find({where: {member: { id: member.id }}})
        }
        return member.memberships;
    }

    // mutations
    @Authorized()
    @Mutation(() => Member)
    async addMember(
        @Arg("member") memberInput: MemberInput,
        @Ctx() { member }: Context,
    ): Promise<Member> {
        const newMember = this.memberRepository.create({
            ...memberInput,
            createdBy: member,
        });
        return await this.memberRepository.save(newMember);
    }

    @Authorized()
    @Mutation(() => HouseholdMembership)
    async addHouseholdMember(
        @Arg("member") memberInput: MemberInput,
        @Arg("householdId") householdId: number,
        @Arg("roleId") roleId: number,
        @Ctx() { member }: Context,
    ): Promise<HouseholdMembership> {
        let addMember = await this.memberRepository.findOne({email: memberInput.email});
        if(addMember === undefined) {
            addMember = this.memberRepository.create({
                ...memberInput,
                password: bcrypt.hashSync(memberInput.password || 'changeme'),
                createdBy: member,
            });
            addMember = await this.memberRepository.save(addMember);
        } else {
            await this.memberRepository.update(addMember.id, memberInput);
        }
        let newMembership = await this.membershipRepository.findOne({member: addMember, householdId});
        if(newMembership === undefined) {
            newMembership = await this.membershipRepository.create({
                member: addMember,
                householdId,
                roleId,
            });
        } else {
            newMembership.roleId = roleId;
        }
        return await this.membershipRepository.save(newMembership);
    }

}