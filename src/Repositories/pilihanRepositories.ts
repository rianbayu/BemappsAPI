import { Pilihan, User } from '@Entities';
import { BaseRepositories } from 'luriz_api_shared/repositories/BaseRepositories'
import { getConnection, getManager } from 'typeorm';
import { TransporterApi } from "luriz_api_shared/services/transporter.service"
import { BaseHelper } from 'luriz_api_shared/helper/BaseHelper'
const MainHelper = new BaseHelper()
const moment = require('moment-timezone')
export class PilihanRepositories extends BaseRepositories {

    private static instance: PilihanRepositories;
    endPage: any;

    public static getInstance(): PilihanRepositories {
        if (!PilihanRepositories.instance) {
            PilihanRepositories.instance = new PilihanRepositories();
        }

        return PilihanRepositories.instance;
    }

    constructor() {
        super(Pilihan)
        this.setConnection(getConnection())
        this.setManager(getManager())
    }

    public async list(payload: any): Promise<any> {

        // params variable 
        let take: number = payload!['limit'] || 10
        let page: number = payload!['page'] || 1
        // let order: string = payload!['order'] || 'created_at'
        let sort = payload!['sort'] || 'DESC'
        let status = '1'
        let lokasi = payload!['lokasi']
        const skip: number = (page - 1) * take // paging
        let data: any;
        var dataTransform: any = []

        try {

            let query = await this.getOrmRepository(Pilihan).createQueryBuilder('p')
                .select(['p.*', 'u.nama_lengkap as nama_lengkap'])
                .leftJoin(User, 'u', 'u.id = p.user_id')
                .offset(skip)
                .limit(take)

            let total = await query.getCount()
            let queryResult = await query.getRawMany()

            if (!queryResult.length) {
                return this.resultRepository({}, 'data not found', 204)
            }

            data = {
                count: total,
                pages: Math.ceil(total / take),
                page: page,
                limit: take,
                data: queryResult
            }

            return this.resultRepository(data)

        } catch (err) {
            return this.resultErrorRepository(err)

        }
    }

    public async pilihanFindId(params: any, id: number): Promise<any> {

        try {
            const query = await this.getOrmRepository(Pilihan)
                .createQueryBuilder('p')
                .select(['p.*', 'u.nama_lengkap as nama_lengkap'])
                .leftJoin(User, 'u', 'u.id = p.user_id')
                .where(`user_id=${id}`)
            const data = await query.getRawOne()
            const checkmany = await query.getRawMany()

            if (!checkmany.length) {
                return this.resultRepository({}, 'Maaf, id user tidak ada', 204)
            }

            return this.resultRepository(data)
        } catch (err) {
            return this.resultErrorRepository(err)
        }
    }

    public async add(payload: any): Promise<any> {

        // params variable 
        let user_id = payload['user_id'];
        let p_satu = payload['p_satu'];
        let p_dua = payload['p_dua'];
        let alasan = payload['alasan'];
        let motivasi = payload['motivasi'];
        let berkas = payload['berkas'];

        // transaction
        const connection = getConnection()
        const queryRunner = connection.createQueryRunner()

        // start transaction
        await queryRunner.startTransaction()

        try {
            // GET ID FROM tbl_users
            let queryData = await this.getOrmRepository(User).createQueryBuilder('u')
                .select(['u.id as user_id'])
                .where('u.id =:user_id', {
                    user_id: user_id
                })
                .getRawMany()

            let queryDataPilihan = await this.getOrmRepository(Pilihan).createQueryBuilder('p')
                .select(['p.user_id as user_id'])
                .where('p.user_id =:user_id', {
                    user_id: user_id
                })
                .getCount()

            if (!queryData.length) {
                return this.resultRepository({}, 'Maaf, id tidak ada ', 204)
            }

            if (queryDataPilihan > 0) {
                return this.resultRepository({}, 'Maaf, Gagal input lebih dari 1 ', 204)
            }

            let dataPilihan = new Pilihan()
            dataPilihan.user_id = user_id
            dataPilihan.p_satu = p_satu
            dataPilihan.p_dua = p_dua
            dataPilihan.alasan = alasan
            dataPilihan.motivasi = motivasi
            dataPilihan.berkas = berkas

            // insert to blog_counter
            let insert = await queryRunner.manager.save(Pilihan, dataPilihan)

            // Transaction commit
            await queryRunner.commitTransaction();

            return this.resultRepository(insert, null, 201)

        } catch (err) {
            return this.resultErrorRepository(err)

        }
    }

    public async UpdatePilihan(payload: any): Promise<any> {

        // body req payload
        let id = payload['id']
        let p_satu = payload['p_satu'];
        let p_dua = payload['p_dua'];
        let alasan = payload['alasan'];
        let motivasi = payload['motivasi'];
        let berkas = payload['berkas'];

        // transaction
        const connection = getConnection()
        const queryRunner = connection.createQueryRunner()

        // start transaction
        await queryRunner.startTransaction()
        try {
            const query = await this.getOrmRepository(Pilihan)
                .createQueryBuilder('p')
                .select(['p.*', 'u.nama_lengkap as nama_lengkap'])
                .leftJoin(User, 'u', 'u.id = p.id')
                .where('p.id =:id', {
                    id: id
                })
            const checkmany = await query.getRawMany()

            if (!checkmany.length) {
                return this.resultRepository({}, 'Maaf, id tidak ada', 204)
            }

            await this.getOrmRepository(Pilihan).createQueryBuilder('p')
                .select(['p.id as id'])
                .where('p.id =:id', {
                    id: id
                })
                .getRawOne()

            // update data socmed
            let PayloadUpdatedPilihan = {
                p_satu: p_satu,
                p_dua: p_dua,
                alasan: alasan,
                motivasi: motivasi,
                berkas: berkas
            }

            await queryRunner.manager.update(Pilihan, {
                id: id
            }, PayloadUpdatedPilihan)


            // Transaction commit
            await queryRunner.commitTransaction();

            return this.resultRepository(PayloadUpdatedPilihan)

        } catch (err) {
            await queryRunner.rollbackTransaction(); // Transaction roolback
            return this.resultErrorRepository(err)
        } finally {
            await queryRunner.release(); // Transaction release
        }
    }

    public async deletePilihan(payload: any): Promise<any> {

        var payloads = []
        for (const row in payload) {
            var obj: any = {}
            obj.id = payload[row].id
            payloads.push(obj)
        }

        const connection = getConnection()
        const queryRunner = connection.createQueryRunner()

        try {

            const deleted = await queryRunner.manager.delete(Pilihan, payloads)

            if (deleted) {
                return this.resultRepository(payloads, `deleted (${payloads.length}) success`, 201)
            } else {
                await this.rollback()
            }
        } catch (err) {

            return this.resultErrorRepository(err)
        }
    }
}