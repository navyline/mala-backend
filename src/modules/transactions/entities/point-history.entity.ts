import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { MemberEntity } from '../../members/entities/member.entity';
import { TransactionEntity } from './transaction.entity';

@Entity('point_histories')
export class PointHistoryEntity {
  // Primary Key
  @PrimaryGeneratedColumn('uuid')
  id: string; 

  @Column({ type: 'enum', enum: ['EARN', 'REDEEM'] }) //Type of Point Change (Earned or Redeemed)
  action_type: string;

  @Column({ type: 'int' }) // Number of Points Earned or Redeemed (positive for EARN, negative for REDEEM)
  points: number;

  @Column({ type: 'varchar', length: 255, nullable: true }) // Description of the Point Change
  description: string;

  @CreateDateColumn() // Timestamp of when the Point Change Occurred
  created_at: Date;

  // Foreign Key 
  @ManyToOne(() => MemberEntity, (member) => member.PointHistory)
  @JoinColumn({ name: 'member_id' })
  member: MemberEntity;

  @ManyToOne(() => TransactionEntity, (transaction) => transaction.point_histories, { nullable: true })
  @JoinColumn({ name: 'transaction_id' })
  transaction: TransactionEntity;
}