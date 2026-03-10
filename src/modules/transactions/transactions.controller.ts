import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';

@Controller('transactions') 
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  // POST /transactions/checkout ==> process a checkout transaction, calculate points, and update member's points
  @Post('checkout')
  async checkout(
    @Body() body: { 
      member_id: string; 
      totalAmount: number; 
      pointsToUse?: number;
    }
  ) {
  
    return await this.transactionsService.checkout(
      body.member_id,
      body.totalAmount,
      body.pointsToUse || 0, 
    );
  }

  // GET /transactions/history/:member_id ==> get transaction history for a member
  @Get('history/:member_id')
  async getHistory(@Param('member_id') memberId: string) {
    return await this.transactionsService.getHistory(memberId);
  }

}

function AuthGuard(arg0: string): Function | import("@nestjs/common").CanActivate {
  throw new Error('Function not implemented.');
}
