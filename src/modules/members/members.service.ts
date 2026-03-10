import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MemberEntity } from './entities/member.entity';
import * as crypto from 'crypto';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(MemberEntity)
    private readonly memberRepository: Repository<MemberEntity>,
  ) {}

  // New Member Registration Function
  async createMember(phone: string, name: string): Promise<MemberEntity> {
    const newMember = this.memberRepository.create({
      number_code: `MCD-${crypto.randomBytes(4).toString('hex')}`, // create member code using random hex
      phone,
      name,
      total_points: 0, 
    });
    
    // Save into database 
    return await this.memberRepository.save(newMember);
  }

  // GET points function
  async getPoints(id: string) {
    const member = await this.memberRepository.findOne({
      where: { id },
      select: ['id', 'name', 'phone', 'total_points', 'number_code'], 
    });

    if (!member) {
      throw new NotFoundException('ไม่พบข้อมูลสมาชิกนี้ในระบบ');
    }

    return member;
  }
}
