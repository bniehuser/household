import HouseholdResolvers from "./household";
import { AuthResolver } from "./Auth.resolver";

export default [
    ...HouseholdResolvers,
    AuthResolver
];