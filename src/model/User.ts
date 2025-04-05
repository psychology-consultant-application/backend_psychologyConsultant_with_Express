import { IsString,IsUppercase } from "class-validator";
import { Entity,PrimaryGeneratedColumn,Column,CreateDateColumn,UpdateDateColumn,DeleteDateColumn, OneToMany } from "typeorm";
import bcrypt from 'bcryptjs';
import { appoinment } from "./appoinment";
import { Article } from './article';



export enum UserRole {
    ADMIN = 'ADMIN',
    CONSULTANT = 'CONSULTANT',
    PASIEN = 'PASIEN',
}

@Entity()
export class User{

    @PrimaryGeneratedColumn('uuid')
    public id : string

    
    @Column({
        default: null,
        nullable: true
    })
    @IsString()
    public namaLengkap: string


    @Column({
        default: null,
        nullable: true
    })
    @IsString()
    public userName: string

    @Column({
        default: null,
        nullable: true
    })
    @IsString()
    public password: string


    @Column({
        type: 'enum',
        enum: UserRole,
    })
    @IsString()
    @IsUppercase()
    public role: UserRole


    @CreateDateColumn()
    public createdAt: Date

    @UpdateDateColumn()
    public updatedAt: Date

    @DeleteDateColumn()
    public deletedAt: Date

    
    @OneToMany (() => appoinment, (appoinmentPasien) => appoinmentPasien.pasienId)
    public appoinmentPasien : appoinment

    @OneToMany (() => appoinment, (appoinmentPsychology) => appoinmentPsychology.psychologyId)
    public appoinmentPsychology : appoinment


    @OneToMany (() => Article, (user) => user.updatedBy)
    public userArticle : Article



    public hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8)
    }

    public checkIfPasswordMatch(unencryptedPassword: string): boolean {
        return bcrypt.compareSync(unencryptedPassword, this.password)
    }
}