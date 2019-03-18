import { FieldResolver, Query, Resolver, Root } from "type-graphql/dist";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Repository } from "typeorm";
import { HouseholdMembership } from "../models/HouseholdMembership";
import { Household } from "../models/Household";
import { Member } from "../models/Member";

@Resolver(() => HouseholdMembership)
export class HouseholdMembershipResolver {
    constructor(
        @InjectRepository(HouseholdMembership) private readonly membershipRepository: Repository<HouseholdMembership>,
        @InjectRepository(Household) private readonly householdRepository: Repository<Household>,
        @InjectRepository(Member) private readonly memberRepository: Repository<Member>,
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
        console.log('should be looking up member by id', membership.memberId);
        if(membership.member === undefined) {
            membership.member = await this.memberRepository.findOne(membership.memberId);
        }
        return membership.member;
    }

}