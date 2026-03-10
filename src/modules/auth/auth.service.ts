import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MemberEntity } from '../members/entities/member.entity';

// authentication service for handling login and JWT token generation
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(MemberEntity)
    private readonly memberRepository: Repository<MemberEntity>,
    private readonly jwtService: JwtService, 
  ) {}

  async login(phone: string) {
    const member = await this.memberRepository.findOne({
      where: { phone: phone },
    });

    if (!member) {
      throw new UnauthorizedException('ไม่พบเบอร์โทรศัพท์นี้ในระบบ โปรดสมัครสมาชิกก่อน');
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
}