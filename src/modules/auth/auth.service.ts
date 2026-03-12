import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { MemberEntity } from '../members/entities/member.entity';

// authentication service for handling login and JWT token generation
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(MemberEntity)
    private readonly memberRepository: Repository<MemberEntity>,
    private readonly jwtService: JwtService, 
  ) {}

  // Login method: checks if the phone number exists, and if so, generates a JWT token with member info
  async login(phone: string) {
    const member = await this.memberRepository.findOne({
      where: { phone: phone },
    });

    if (!member) {
      throw new Error('ไม่พบเบอร์โทรศัพท์นี้ในระบบ โปรดสมัครสมาชิกก่อน');
    }

    const payload = { 
      sub: member.id, 
      phone: member.phone 
    };

    return {
      message: 'เข้าสู่ระบบสำเร็จ',
      access_token: this.jwtService.sign(payload), 
      
      member_info: {
        id: member.id,
        name: member.name,
        total_points: member.total_points
      }
    };
  }

async register(name: string, phone: string) {
  const existingMember = await this.memberRepository.findOne({
    where: { phone: phone }
  });

  if (existingMember) {
    throw new Error('เบอร์โทรศัพท์นี้ถูกใช้งานไปแล้ว');
  }

  const newMember = this.memberRepository.create({
    name,
    number_code: `MCD-${randomBytes(4).toString('hex')}`, // create member code using random hex
    phone,
    total_points: 0,
  });

  const savedMember = await this.memberRepository.save(newMember);

  const payload = { 
    sub: savedMember.id, 
    phone: savedMember.phone 
  };

  return {
    message: 'สมัครสมาชิกสำเร็จ ยินดีต้อนรับครับ!',
    access_token: this.jwtService.sign(payload),
    member_info: {
      id: savedMember.id,
      name: savedMember.name,
      total_points: savedMember.total_points
    }
  };
}
}