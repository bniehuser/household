import { HouseholdMembership, Member } from "../../models/household";
import { Arg, Authorized, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from "type-graphql/dist";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { MemberInput } from "./types/input/MemberInput";
import bcrypt from 'bcryptjs';
import { IContext } from '../../application/types/context';


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
    @Authorized('ADMIN','ADD')
    @Mutation(() => Member)
    async addMember(
        @Arg("member") memberInput: MemberInput,
        @Ctx() { membership }: IContext,
    ): Promise<Member> {
        const newMember = this.memberRepository.create({
            ...memberInput,
            createdBy: membership.member,
        });
        return await this.memberRepository.save(newMember);
    }



}