import { IsDate, IsInt, IsString,IsUppercase } from "class-validator";
import { Entity,PrimaryGeneratedColumn,Column,CreateDateColumn,UpdateDateColumn,DeleteDateColumn, OneToMany, ManyToOne, JoinColumn, Int32 } from "typeorm";
import { User } from "./User";

export enum jenisMeditasi {
    MEDITASI = 'MEDITASI',
    LELAP = 'LELAP'
}


export enum rekmonedasiMditasi {
    SERI = 'SERI',
    INSTAN = 'INSTAN'
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
    public topikMeditasi: string

    @Column({
        default: null,
        nullable: true
    })
    @IsString()
    public isiContent: string

    @Column({
        type: 'timestamp', // Tambahkan tipe eksplisit
        default: null,
        nullable: true
    })
    @IsDate()
    public reminderMEditasi: Date


    @Column({
        type: 'enum',
        enum: jenisMeditasi,
        default: null
    })
    @IsString()
    @IsUppercase()
    public status: jenisMeditasi


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