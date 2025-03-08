import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Order {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column()
    customerName: string

    @Column()
    email: string

    @Column()
    address: string
}