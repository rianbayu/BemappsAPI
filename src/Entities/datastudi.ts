import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity("tbl_data_studi", {})
export class DataStudi {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id?: string;

  @Column()
  user_id?: number;

  @Column()
  npm?: number;

  @Column()
  jurusan?: string;

  @Column()
  sks?: number;

  @Column("float", {
    name: "ipk_lokal",
    nullable: false,
  })
  ipk_lokal?: string;

  @Column("float", {
    name: "ipk_utama",
    nullable: false,
  })
  ipk_utama?: string;

  @Column("float", {
    name: "rangkuman",
    nullable: false,
  })
  rangkuman?: string;

  @Column()
  tahun_masuk?: Date;
}