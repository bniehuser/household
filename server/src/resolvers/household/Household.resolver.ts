import { Arg, Authorized, Ctx, FieldResolver, Query, Resolver, Root } from "type-graphql/dist";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Equal, FindOperator, In, Repository } from "typeorm";
import { Household, HouseholdMembership, Member } from "../../models/household";
import { IContext } from "../../application/types/context";

@Resolver(() => Household)
export class HouseholdResolver {
    constructor(
        @InjectRepository(Household) private readonly householdRepository: Repository<Household>,
        @InjectRepository(HouseholdMembership) private readonly membershipRepository: Repository<HouseholdMembership>,
        @InjectRepository(Member) private readonly memberRepository: Repository<Member>,
    ) {}

    @Authorized()
    @Query(() => [Household])
    async households(@Ctx() context: IContext): Promise<Household[]> {
        const where: { id?: FindOperator<HouseholdMembership>|number } = {};
        if(!context.membership.isSuperAdmin) {
            // should we load households in context?  at least the ids?
            const householdIds = await this.membershipRepository.createQueryBuilder()
                .where({memberId: context.membership.memberId})
                .getMany()
                .then(memberships => memberships.map(m => m.householdId));
            where.id = In(householdIds);
        }
        return await this.householdRepository.find({
            where,
            relations: ['memberships', 'memberships.member'],
        });
    }

    @Authorized()
    @Query(() => Household, { nullable: true })
    async household(
        @Ctx() context: IContext,
        @Arg('id', { nullable: true }) id?: number,
     ): Promise<Household> {
        let householdId = context.membership.householdId;
        if(id) {
            householdId = context.membership.isSuperAdmin || id === householdId ? id : null;
        }
        return householdId
            ? await this.householdRepository.findOne(householdId, {relations: ['memberships', 'memberships.member']})
            : await null;
    }

    @FieldResolver()
    async memberships(@Root() household: Household): Promise<HouseholdMembership[]> {
        if(household.memberships === undefined) {
            household.memberships = await this.membershipRepository.find({where: {household: {id: household.id}}})
        }
        return household.memberships;
    }

}