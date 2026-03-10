import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionEntity } from './entities/transaction.entity';
import { MemberEntity } from '../members/entities/member.entity';
import { DataSource } from 'typeorm';

// service for handling transactions, including checkout and transaction history retrieval
@Injectable()
export class TransactionsService {
  constructor(
      @InjectRepository(TransactionEntity)
      private readonly transactionsRepository: Repository<TransactionEntity>,
      private dataSource: DataSource,
    ) {}

      async checkout(member_id: string, totalAmount: number, pointsUsed: number = 0 ) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
          const member = await queryRunner.manager.findOne(MemberEntity, { where: { id: member_id } });
          if (!member) {
            throw new BadRequestException('ไม่พบข้อมูลสมาชิกนี้ในระบบ');
          }
          if (pointsUsed > member.total_points) {
            throw new BadRequestException('คะแนนสะสมไม่เพียงพอ');
          }

          const discountAmount = pointsUsed ; // 1 Point = 1 THB discount
          const netAmount = totalAmount - discountAmount;
          const pointsEarned = Math.floor(netAmount / 10); // Earn 1 point for every 10 THB spent

          const newTx = queryRunner.manager.create(TransactionEntity, {
            receipt_number: `RCPT-${Date.now()}`,
            total_amount: totalAmount,
            discount_amount: discountAmount,
            net_amount: netAmount,
            member: { id: member_id },
          });
          const savedTx = await queryRunner.manager.save(newTx);

          if (pointsUsed > 0) {
            const redeemHistory = queryRunner.manager.create('PointHistoryEntity', {
              action_type: 'REDEEM',
              points: -pointsUsed,
              description: `ใช้คะแนนแลกรับส่วนลด ${discountAmount.toFixed(2)} บาท`,
              member: { id: member_id },
              transaction: savedTx,
            });
            await queryRunner.manager.save(redeemHistory);
          }

          if (pointsEarned > 0) {
            const earnHistory = queryRunner.manager.create('PointHistoryEntity', {
              action_type: 'EARN',
              points: pointsEarned,
              description: `ได้รับคะแนนจากการซื้อสินค้า มูลค่า ${netAmount.toFixed(2)} บาท`,
              member: { id: member_id },
              transaction: savedTx,
            });
            await queryRunner.manager.save(earnHistory);
          }

          member.total_points = member.total_points - pointsUsed + pointsEarned;
          await queryRunner.manager.save(member);

          await queryRunner.commitTransaction();

          return {
            message: 'ทำรายการสำเร็จ',
            receipt: savedTx.receipt_number,
            netAmount:  netAmount,
            pointsEarned: pointsEarned,
            total_points: member.total_points,
          } 
          } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException('เกิดข้อผิดพลาดในการทำรายการ: ' + error.message);
          } finally {
            await queryRunner.release();
          }
      }

      // Get Transaction History for a Member
  async getHistory(memberId: string) {
    const history = await this.transactionsRepository.find({
      where: { member: { id: memberId } },
      
      relations: ['point_histories'],
      
      order: {
        created_at: 'DESC',
      },
    });

    if (!history || history.length === 0) {
      return { message: 'ยังไม่มีประวัติการใช้จ่าย' };
    }

    return history;
  }

}
