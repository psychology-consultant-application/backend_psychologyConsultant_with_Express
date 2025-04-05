import { IsString } from "class-validator";
import { Column,Entity,PrimaryGeneratedColumn,CreateDateColumn,UpdateDateColumn,DeleteDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";



@Entity()
export class Article{
    @PrimaryGeneratedColumn('uuid')
    public id : string

    @Column({
        type : 'longtext',
        default : null,
        nullable : true
    })
    @IsString()
    public image : string

    @Column()
    @IsString()
    public title : string

    @Column()
    @IsString()
    public description : string

    @CreateDateColumn()
    public createdAt : Date

    @UpdateDateColumn()
    public updateAt : Date

    @DeleteDateColumn()
    public deletedAt : Date

    @ManyToOne(() => User, (updatedBy) => updatedBy.userArticle)
    @JoinColumn()
    public updatedBy : User

}