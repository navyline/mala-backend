import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { MemberEntity } from '../../members/entities/member.entity';
import { PointHistoryEntity } from './point-history.entity';

@Entity('transactions')
export class TransactionEntity {
  
  // Primary Key
  @PrimaryGeneratedColumn('uuid')
  id: string; 

  @Column({ type: 'varchar', length: 50, unique: true }) // Unique Receipt Number (ex. RCPT-1627384950123)
  receipt_number: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 }) // Total Amount Before Discount
  total_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 }) // Discount Amount from Redeemed Points
  discount_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 }) // Final Amount After Discount
  net_amount: number;

  @CreateDateColumn() // Timestamp of when the Transaction Occurred
  created_at: Date;

  // Foreign Key 
  @ManyToOne(() => MemberEntity, (member) => member.transactions) // Many Transactions can belong to One Member
  @JoinColumn({ name: 'member_id' })
  member: MemberEntity;

  @OneToMany(() => PointHistoryEntity, (pointHistory) => pointHistory.transaction) // One Transaction can have Many Point History Records (for both EARN and REDEEM)
  point_histories: PointHistoryEntity[];
}