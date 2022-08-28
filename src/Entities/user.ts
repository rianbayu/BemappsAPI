import { Column, Entity, PrimaryGeneratedColumn} from "typeorm";
@Entity("tbl_users", {})
export class User {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id?: string;

  @Column()
  username?: string;
  
  @Column()
  password?: string;
  
  @Column()
  nama_lengkap?: string;
  
  @Column()
  panggilan?: string;
  
  @Column()
  email?: string;
  
  @Column()
  no_hp?: string;
  
  @Column()
  no_hp_ortu?: string;
  
  @Column()
  id_line?: string;
  
  @Column()
  instagram?: string;
  
  @Column()
  alamat_rumah?: string;
  
  @Column()
  alamat_kost?: string;
  
  @Column()
  ttl?: string;
  
  @Column()
  jk?: string;
  
  @Column()
  created_at?: Date;
  
  @Column()
  user_status?: string;
  
  @Column()
  status_berkas?: string;
}