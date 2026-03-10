import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Transaction, UpdateDateColumn } from "typeorm";
import { TransactionEntity } from "src/modules/transactions/entities/transaction.entity";
import { PointHistoryEntity } from "src/modules/transactions/entities/point-history.entity";

@Entity('members') //Table Name in Database

export class MemberEntity {

    @PrimaryGeneratedColumn('uuid') // Primary Key
    id: string;

    @Column({type: 'varchar', length: 50, unique: true}) // Unique Member Code (ex. MBR-0001, MBR-0002) For QR Code 
    number_code: string;

    @Column({type: 'varchar', length: 15, unique: true}) // Unique Phone Number
    phone: string;

    @Column({type: 'varchar', length: 100}) // Member's Full Name
    name: string;

    @Column({type: 'int', default: 0}) // Current Points 
    total_points: number;

    @CreateDateColumn() // Record Creation Timestamp
    created_at: Date;

    @UpdateDateColumn() // Record Update Timestamp
    updated_at: Date;

    @OneToMany(() => TransactionEntity, transaction => transaction.member) // One Member can have Many Transactions
    transactions: TransactionEntity[];

    @OneToMany(() => PointHistoryEntity, PointHistory => PointHistory.member) // One Member can have Many Point History Records
    PointHistory: PointHistoryEntity[];
}
