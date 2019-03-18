import { Household } from "../models/Household";
import { FieldResolver, Query, Resolver, Root } from "type-graphql/dist";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Repository } from "typeorm";
import { HouseholdMembership } from "../models/HouseholdMembership";
import { Member } from "../models/Member";

@Resolver(() => Household)
export class HouseholdResolver {
    constructor(
        @InjectRepository(Household) private readonly householdRepository: Repository<Household>,
        @InjectRepository(HouseholdMembership) private readonly membershipRepository: Repository<HouseholdMembership>,
        @InjectRepository(Member) private readonly memberRepository: Repository<Member>,
    ) {}

    @Query(() => [Household])
    households(): Promise<Household[]> {
        return this.householdRepository.find({ relations: ['memberships', 'memberships.member']});
    }

    @FieldResolver()
    async memberships(@Root() household: Household): Promise<HouseholdMembership[]> {
        if(household.memberships === undefined) {
            household.memberships = await this.membershipRepository.find({where: {household: { id: household.id }}})
        }
        return household.memberships;
    }
}