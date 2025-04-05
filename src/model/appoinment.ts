import { IsDate, IsInt, IsString,IsUppercase } from "class-validator";
import { Entity,PrimaryGeneratedColumn,Column,CreateDateColumn,UpdateDateColumn,DeleteDateColumn, OneToMany, ManyToOne, JoinColumn, Int32 } from "typeorm";
import { User } from "./User";


export enum StatusAppoinment {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    COMPLETED = 'COMPLETED',
    CANCELED = 'CANCELED',


}

@Entity()
export class appoinment{

    @PrimaryGeneratedColumn('uuid')
    public id : string

    
    @Column({
        type: 'varchar', // Tambahkan tipe eksplisit
        default: null,
        nullable: true
    })
    @IsString()
    public meetLink: string

    @Column({
        type: 'int', // Tambahkan tipe eksplisit
        default: null,
        nullable: true
    })
    @IsInt()
    public durationMinute: number

    @Column({
        type: 'timestamp', // Tambahkan tipe eksplisit
        default: null,
        nullable: true
    })
    @IsDate()
    public appoinmentDate: Date


    @Column({
        type: 'enum',
        enum: StatusAppoinment,
        default: StatusAppoinment.PENDING
    })
    @IsString()
    @IsUppercase()
    public status: StatusAppoinment

    @CreateDateColumn()
    public createdAt: Date

    @UpdateDateColumn()
    public updatedAt: Date

    @DeleteDateColumn()
    public deletedAt: Date


    @ManyToOne (() => User, (pasienId) => pasienId.appoinmentPasien)
    @JoinColumn()
    public pasienId : User


    @ManyToOne (() => User, (psychologyId) => psychologyId.appoinmentPsychology)
    @JoinColumn()
    public psychologyId : User


}