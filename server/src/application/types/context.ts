import { Household, Member } from '../../models/household';

export interface IContext {
    member: Member;
    household?: Household;
}