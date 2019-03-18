import { HouseholdMembershipResolver} from "./HouseholdMembership.resolver";
import { MemberResolver} from "./Member.resolver";
import { HouseholdResolver } from "./Household.resolver";

export default [
    HouseholdResolver,
    HouseholdMembershipResolver,
    MemberResolver,
];