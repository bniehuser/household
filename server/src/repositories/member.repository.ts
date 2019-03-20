import { DeepPartial, EntityRepository, Repository, UpdateResult } from 'typeorm';
import { Member } from '../models/household';
import * as bcrypt from 'bcryptjs';

@EntityRepository(Member)
export class MemberRepository extends Repository<Member> {

    static setPassword(member: Member, password: string): Member {
        member.password = bcrypt.hashSync(password);
        return member;
    }

    findByHousehold(householdId: number) {
        return "";
    }

}