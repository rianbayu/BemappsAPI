import { Column, Entity, PrimaryGeneratedColumn} from "typeorm";
@Entity("tbl_faq", {})
export class Faq {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id?: string;
  
  @Column()
  user_id?:number;
  
  @Column()
  komentar?:string;
  
  @Column()
  jawaban?:string;
  
  @Column()
  status?:string;
  
}
