import { Member } from "../models/Member";
import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from "type-graphql/dist";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Repository } from "typeorm";
import { HouseholdMembership } from "../models/HouseholdMembership";
import { Context } from "vm";
import { MemberInput } from "./types/input/MemberInput";
import bcrypt from 'bcryptjs';


@Resolver(() => Member)
export class MemberResolver {
    constructor(
        @InjectRepository(Member) private readonly memberRepository: Repository<Member>,
        @InjectRepository(HouseholdMembership) private readonly membershipRepository: Repository<HouseholdMembership>,
    ) {}

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

    @Mutation(() => HouseholdMembership)
    async addHouseholdMember(
        @Arg("member") memberInput: MemberInput,
        @Arg("householdId") householdId: number,
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
        }
        const newMembership = await this.membershipRepository.create({
            member: addMember,
            householdId,
        });
        return await this.membershipRepository.save(newMembership);
    }

}