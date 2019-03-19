import { Authorized, Ctx, FieldResolver, Query, Resolver, Root } from "type-graphql/dist";
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
        // EWW GROSS, IMPLEMENTATION SHOULD NEVER BE UP TO THE RESOLVER ON THIS
        if(!context.membership.permissions.some(p => p.key === 'SUPER_ADMIN')) {
            // should we load households in context?  at least the ids?
            // we're going to severely slow down the server with all these lookups
            const householdIds = await this.membershipRepository.createQueryBuilder()
                .where({memberId: context.membership.member.id})
                .getMany()
                .then(memberships => memberships.map(m => m.householdId));
            where.id = In(householdIds);
        }
        return await this.householdRepository.find({
            where,
            relations: ['memberships', 'memberships.member'],
        });
    }

    @FieldResolver()
    async memberships(@Root() household: Household): Promise<HouseholdMembership[]> {
        if(household.memberships === undefined) {
            household.memberships = await this.membershipRepository.find({where: {household: { id: household.id }}})
        }
        return household.memberships;
    }

}