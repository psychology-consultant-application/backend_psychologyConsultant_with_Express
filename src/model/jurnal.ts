import { IsDate, IsInt, IsString,IsUppercase } from "class-validator";
import { Entity,PrimaryGeneratedColumn,Column,CreateDateColumn,UpdateDateColumn,DeleteDateColumn, OneToMany, ManyToOne, JoinColumn, Int32 } from "typeorm";
import { User } from "./User";


export enum StatusJurnal {
    ONGOING = 'ONGOING',
    COMPLETED = 'DONE'
}

@Entity()
export class jurnal{

    @PrimaryGeneratedColumn('uuid')
    public id : string

    
    @Column({
        default: null,
        nullable: true
    })
    @IsString()
    public topikJurnal: string

    @Column({
        default: null,
        nullable: true
    })
    @IsString()
    public isiJurnal: string

    @Column({
        type: 'timestamp', // Tambahkan tipe eksplisit
        default: null,
        nullable: true
    })
    @IsDate()
    public tanggalRilisJurnal: Date


    @Column({
        type: 'enum',
        enum: StatusJurnal,
        default: StatusJurnal.ONGOING
    })
    @IsString()
    @IsUppercase()
    public status: StatusJurnal


    @Column({
        default: null,
        nullable: true
    })
    @IsString()
    public pasienId: string

    @CreateDateColumn()
    public createdAt: Date

    @UpdateDateColumn()
    public updatedAt: Date

    @DeleteDateColumn()
    public deletedAt: Date




}