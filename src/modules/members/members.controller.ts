import { Controller, Get, Post, Body, Request } from '@nestjs/common';
import { MembersService } from './members.service';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  // POST /members ==> create a new member with phone and name, return member info and initial points
  @Post()
  async create(@Body() body: { phone: string; name: string }) {
    return await this.membersService.createMember(body.phone, body.name);
  }

  // GET /members/me/points ==> get the authenticated member's points and info
  @Get('me/points')
  async getMyPoints(@Request() req: any) {
    const secureMemberId = req.user.userId;
    return await this.membersService.getPoints(secureMemberId);
  }
}