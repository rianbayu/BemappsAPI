import { Pilihan, User } from '@Entities';
import { BaseRepositories } from 'luriz_api_shared/repositories/BaseRepositories'
import { getConnection, getManager } from 'typeorm';
import { TransporterApi } from "luriz_api_shared/services/transporter.service"
import { BaseHelper } from 'luriz_api_shared/helper/BaseHelper'
const Password = require("node-php-password");
const MainHelper = new BaseHelper()
const moment = require('moment-timezone')
export class UserRepositories extends BaseRepositories {

    private static instance: UserRepositories;
    endPage: any;

    public static getInstance(): UserRepositories {
        if (!UserRepositories.instance) {
            UserRepositories.instance = new UserRepositories();
        }

        return UserRepositories.instance;
    }

    constructor() {
        super(User)
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

            let query = await this.getOrmRepository(User).createQueryBuilder('u')
                .select(['u.*'])
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

    public async UserFindId(params: any): Promise<any> {

        try {

            let findId = await this.getOrmRepository(User).findOne({
                where: {
                    id: params.id
                }
            })

            if (!findId) {
                return this.resultErrorRepository('Users Not Found', 404)
            }

            return this.resultRepository(findId)

        } catch (err) {
            return this.resultErrorRepository(err)

        }
    }

    // ONLY

    public async UserPendingStatus(payload: any): Promise<any> {

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

            let query = await this.getOrmRepository(User).createQueryBuilder('u')
                .select(['u.*'])
                .where("user_status = 'pending' ")
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

    public async UserTrueStatus(payload: any): Promise<any> {

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

            let query = await this.getOrmRepository(User).createQueryBuilder('u')
                .select(['u.*'])
                .where("user_status = 'true' ")
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

    public async UserFalseStatus(payload: any): Promise<any> {

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

            let query = await this.getOrmRepository(User).createQueryBuilder('u')
                .select(['u.*'])
                .where("user_status = 'false' ")
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


    public async berkasListAll(params: any): Promise<any> {

        try {
            let query = await this.getOrmRepository(Pilihan).createQueryBuilder('p')
                .select(['p.*', 'u.nama_lengkap as nama_lengkap', 'u.status_berkas as status_berkas'])
                .leftJoin(User, 'u', 'u.id = p.user_id')

            let queryResult = await query.getRawMany()

            if (!queryResult.length) {
                return this.resultRepository({}, 'data not found', 204)
            }

            return this.resultRepository(queryResult)
        } catch (err) {
            return this.resultErrorRepository(err)
        }
    }
    public async berkasPendingStatus(params: any): Promise<any> {

        try {
            let query = await this.getOrmRepository(Pilihan).createQueryBuilder('p')
                .select(['p.*', 'u.nama_lengkap as nama_lengkap', 'u.status_berkas as status_berkas'])
                .leftJoin(User, 'u', 'u.id = p.user_id')
                .where("u.status_berkas = 'pending' ")

            let total = await query.getCount()
            let queryResult = await query.getRawMany()

            if (!queryResult.length) {
                return this.resultRepository({}, 'data not found', 204)
            }


            return this.resultRepository(queryResult)

        } catch (err) {
            return this.resultErrorRepository(err)
        }
    }

    public async berkasTrueStatus(params: any): Promise<any> {

        // params variable 


        try {
            let query = await this.getOrmRepository(Pilihan).createQueryBuilder('p')
                .select(['p.*', 'u.nama_lengkap as nama_lengkap', 'u.status_berkas as status_berkas'])
                .leftJoin(User, 'u', 'u.id = p.user_id')
                .where("u.status_berkas = 'true' ")

            let total = await query.getCount()
            let queryResult = await query.getRawMany()

            if (!queryResult.length) {
                return this.resultRepository({}, 'data not found', 204)
            }


            return this.resultRepository(queryResult)

        } catch (err) {
            return this.resultErrorRepository(err)
        }
    }

    public async berkasFalseStatus(params: any): Promise<any> {

        try {
            let query = await this.getOrmRepository(Pilihan).createQueryBuilder('p')
                .select(['p.*', 'u.nama_lengkap as nama_lengkap', 'u.status_berkas as status_berkas'])
                .leftJoin(User, 'u', 'u.id = p.user_id')
                .where("u.status_berkas = 'false' ")

            let total = await query.getCount()
            let queryResult = await query.getRawMany()

            if (!queryResult.length) {
                return this.resultRepository({}, 'data not found', 204)
            }

            return this.resultRepository(queryResult)
        } catch (err) {
            return this.resultErrorRepository(err)
        }
    }

    public async pendingAkhirList(payload: any): Promise<any> {

        // body req payload
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

            let query = await this.getOrmRepository(User).createQueryBuilder('u')
                .select(['u.*'])
                .where("status_berkas = 'true' ")
                .andWhere("user_status = 'pending' ")
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

    // END ONLY


    public async deleteUsers(params: any) {

        let id = params.id

        try {

            let query = await this.getOrmRepository(User).findOne({
                where: {
                    id: id
                }
            })

            if (!query) {
                return this.resultErrorRepository('denied ', 401)
            }

            let dataObject = {
                id: id
            }

            return this.resultRepository(dataObject, 'delete success')

        } catch (err) {
            return this.resultErrorRepository(err)
        }
    }

    public async updateUserBiodata(payload: any): Promise<any> {

        // body req payload
        let id = payload['id'];
        let nama_lengkap = payload['nama_lengkap'];
        let panggilan = payload['panggilan'];
        let email = payload['email'];
        let no_hp = payload['no_hp'];
        let id_line = payload['id_line'];
        let no_hp_ortu = payload['no_hp_ortu'];
        let instagram = payload['instagram'];
        let alamat_rumah = payload['alamat_rumah'];
        let alamat_kost = payload['alamat_kost'];
        let ttl = payload['ttl'];
        let jk = payload['jk'];

        // transaction
        const connection = getConnection()
        const queryRunner = connection.createQueryRunner()

        // start transaction
        await queryRunner.startTransaction()
        try {

            await this.getOrmRepository(User).createQueryBuilder('u')
                .select(['u.id as id'])
                .where('u.id =:id', {
                    id: id
                })
                .getRawOne()

            // update data socmed
            let PayloadUpdatedBiodata = {
                nama_lengkap: nama_lengkap,
                panggilan: panggilan,
                email: email,
                no_hp: no_hp,
                id_line: id_line,
                no_hp_ortu: no_hp_ortu,
                instagram: instagram,
                alamat_rumah: alamat_rumah,
                alamat_kost: alamat_kost,
                ttl: ttl,
                jk: jk,
            }

            await queryRunner.manager.update(User, { // update fb_share + 1
                id: id
            }, PayloadUpdatedBiodata)


            // Transaction commit
            await queryRunner.commitTransaction();

            return this.resultRepository(PayloadUpdatedBiodata)

        } catch (err) {
            await queryRunner.rollbackTransaction(); // Transaction roolback
            return this.resultErrorRepository(err)
        } finally {
            await queryRunner.release(); // Transaction release
        }
    }

    // ADMIN UPDATE STATUS 
    public async statusUsers(payload: any): Promise<any> {

        // body req payload
        let id = payload['id']
        let user_status = payload['user_status'];

        // transaction
        const connection = getConnection()
        const queryRunner = connection.createQueryRunner()

        // start transaction
        await queryRunner.startTransaction()
        try {

            let query = await this.getOrmRepository(User).createQueryBuilder('u')
                .select(['u.id as id', 'u.status_berkas as status_berkas'])
                .where('u.id =:id', {
                    id: id
                })
                .getRawOne()

            if (query.status_berkas === 'false') {
                return this.resultErrorRepository('User tidak lolos tahap seleksi berkas, tidak bisa ubah status akhir', 404)
            }

            if (query.status_berkas === 'pending') {
                return this.resultErrorRepository('Berkas user belum di proses, tidak bisa ke tahap akhir', 404)
            }

            // update data socmed
            let PayloadUpdatedUser = {
                user_status: user_status,
            }

            await queryRunner.manager.update(User, {
                id: id
            }, PayloadUpdatedUser)


            // Transaction commit
            await queryRunner.commitTransaction();

            return this.resultRepository(PayloadUpdatedUser)

        } catch (err) {
            await queryRunner.rollbackTransaction(); // Transaction roolback
            return this.resultErrorRepository(err)
        } finally {
            await queryRunner.release(); // Transaction release
        }
    }

    public async statusUsersBerkas(payload: any): Promise<any> {

        // body req payload
        let id = payload['id']
        let status_berkas = payload['status_berkas'];
        let user_status = payload['user_status'];

        // transaction
        const connection = getConnection()
        const queryRunner = connection.createQueryRunner()

        // start transaction
        await queryRunner.startTransaction()
        try {

            await this.getOrmRepository(User).createQueryBuilder('u')
                .select(['u.id as id'])
                .where('u.id =:id', {
                    id: id
                })
                .getRawOne()

            // update data socmed
            let PayloadUpdatedUser = {
                status_berkas: status_berkas,
                user_status: user_status,
            }

            await queryRunner.manager.update(User, {
                id: id
            }, PayloadUpdatedUser)


            // Transaction commit
            await queryRunner.commitTransaction();

            return this.resultRepository(PayloadUpdatedUser)

        } catch (err) {
            await queryRunner.rollbackTransaction(); // Transaction roolback
            return this.resultErrorRepository(err)
        } finally {
            await queryRunner.release(); // Transaction release
        }
    }

}