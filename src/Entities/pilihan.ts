import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity("tbl_pilihan", {})
export class Pilihan {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id?: string;

  @Column()
  user_id?: number;

  @Column()
  p_satu?: string;

  @Column()
  p_dua?: string;

  @Column()
  alasan?: string;

  @Column()
  motivasi?: string;

  @Column()
  berkas?: string;

}
