import { Authorized, Ctx, FieldResolver, Query, Resolver, Root } from "type-graphql/dist";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Equal, In, Repository } from "typeorm";
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
        console.log('should find households only where member contains', context.member.fullName);
        // const query = this.householdRepository.createQueryBuilder('household')
        //     .innerJoin('household.memberships', 'selectMemberships', 'memberId = :id', {id: context.member.id})
        //     .leftJoin('household.memberships', 'memberships', 'householdId = household.id')
        //     .leftJoin('household.memberships.member', 'members', 'id = memberships.memberId')
        //     .select(['household.*', 'memberships.*','members.*']);
        // console.log(query.getQuery());
        //
        // return Promise.resolve([]); //query.loadMany();
        const householdIds = await this.membershipRepository.createQueryBuilder('membership')
            .select('membership.household_id').where('member_id = :id', {id: context.member.id})
            .getRawMany();
        console.log(householdIds, context.member.id);
        return await this.householdRepository.find({
            where: { id: In(householdIds.map(r => r['household_id'])) },
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