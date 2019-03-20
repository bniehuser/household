import { Household, HouseholdMembership, Member } from "../../models/household";
import { Arg, Authorized, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from "type-graphql/dist";
import { FindOperator, In, Repository } from "typeorm";
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
    async members(@Ctx() context: IContext): Promise<Member[]> {
        const where: { id?: FindOperator<HouseholdMembership>|number } = {};
        if(!context.membership.isSuperAdmin) {
            const memberIds = await this.membershipRepository.createQueryBuilder()
                .where({householdId: context.membership.householdId})
                .getMany()
                .then(memberships => memberships.map(m => m.memberId));
            where.id = In(memberIds);
        }
        return await this.memberRepository.find({
            where,
            relations: [
                'memberships',
                'memberships.household',
            ],
        });

    }

    @Authorized()
    @Query(() => Member, { nullable: true })
    async member(
        @Ctx() context: IContext,
        @Arg('id', { nullable: true }) id?: number,
    ): Promise<Member> {
        let memberId = context.membership.memberId;
        if(id) {
            memberId = context.membership.isSuperAdmin || id === memberId ? id : null;
        }
        return memberId
            ? await this.memberRepository.findOne(memberId, {relations: ['memberships', 'memberships.household']})
            : await null;
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
            createdById: membership.memberId,
        });
        return await this.memberRepository.save(newMember);
    }



}