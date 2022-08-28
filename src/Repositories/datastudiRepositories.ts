import { DataStudi, User } from '@Entities';
import { BaseRepositories } from 'luriz_api_shared/repositories/BaseRepositories'
import { getConnection, getManager } from 'typeorm';
import { TransporterApi } from "luriz_api_shared/services/transporter.service"
import { BaseHelper } from 'luriz_api_shared/helper/BaseHelper'
const MainHelper = new BaseHelper()
const moment = require('moment-timezone')
export class DataStudiRepositories extends BaseRepositories{

    private static instance: DataStudiRepositories;
    endPage:any;

    public static getInstance(): DataStudiRepositories {
        if (!DataStudiRepositories.instance) {
            DataStudiRepositories.instance = new DataStudiRepositories();
        }

        return DataStudiRepositories.instance;
    }

    constructor() {
        super(DataStudi)
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
        let data:any;    
        var dataTransform:any = []

        try {
            // GET ID FROM tbl_users
           let query = await this.getOrmRepository(DataStudi).createQueryBuilder('ds')   
                    .select(['ds.*', 'u.nama_lengkap as nama_lengkap'])  
                    .leftJoin(User, 'u', 'u.id = ds.user_id')
                    .offset(skip)                            
                    .limit(take)   

            let total = await query.getCount() 
            let queryResult = await query.getRawMany()   
            
            if (!queryResult.length) {
                return this.resultRepository({}, 'data not found', 204)
            }
            
            data = {
                count: total,
                pages: Math.ceil(total/take),
                page: page,
                limit: take,
                data: queryResult
            }     

            return this.resultRepository(data)

        } catch (err) {
            return this.resultErrorRepository(err)

        }
    }

    public async datastudiFindId(params: any, id: number): Promise<any> {

        try {
            const query = await this.getOrmRepository(DataStudi)
                .createQueryBuilder('ds')
                .select(['ds.*', 'u.nama_lengkap as nama_lengkap'])
                .leftJoin(User, 'u', 'u.id = ds.user_id')
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
        let npm = payload['npm'];
        let jurusan = payload['jurusan'];
        let sks = payload['sks'];
        let ipk_lokal = payload['ipk_lokal'];
        let ipk_utama = payload['ipk_utama'];
        let rangkuman = payload['rangkuman'];
        let tahun_masuk = payload['tahun_masuk'];

        // transaction
        const connection = getConnection()
        const queryRunner = connection.createQueryRunner()

        // start transaction
        await queryRunner.startTransaction()

        try {
            let queryData = await this.getOrmRepository(User).createQueryBuilder('u')   
                    .select(['u.id as user_id'])  
                    .where('u.id =:user_id',{
                        user_id:user_id
                    })
                    .getRawMany()

            let queryDataPortofolio = await this.getOrmRepository(DataStudi).createQueryBuilder('ds')
                    .select(['ds.user_id as user_id'])
                    .leftJoin(User, 'u', 'u.id = ds.user_id')
                    .where('ds.user_id =:user_id',{
                        user_id:user_id
                    })
                    .getCount()

            if (!queryData.length) {
                return this.resultRepository({}, 'Maaf, id tidak ada ', 204)
            }

            if (queryDataPortofolio > 0) {
                return this.resultRepository({}, 'Maaf, Gagal input lebih dari 1 ', 204)
            }

            let dataDataStudi = new DataStudi()
            dataDataStudi.user_id      = user_id
            dataDataStudi.npm          = npm
            dataDataStudi.jurusan      = jurusan
            dataDataStudi.sks          = sks
            dataDataStudi.ipk_lokal    = ipk_lokal
            dataDataStudi.ipk_utama    = ipk_utama
            dataDataStudi.rangkuman    = rangkuman
            dataDataStudi.tahun_masuk  = tahun_masuk
            
            // insert to blog_counter
            let insert = await queryRunner.manager.save(DataStudi, dataDataStudi)    

            // Transaction commit
            await queryRunner.commitTransaction();

            return this.resultRepository(insert, null, 201)

        } catch (err) {
            return this.resultErrorRepository(err)

        }
    }

    public async updateDataStudi(payload: any): Promise<any> {

        // body req payload
        let id = payload['id']
        let user_id = payload['user_id'];
        let npm = payload['npm'];
        let jurusan = payload['jurusan'];
        let sks = payload['sks'];
        let ipk_lokal = payload['ipk_lokal'];
        let ipk_utama = payload['ipk_utama'];
        let rangkuman = payload['rangkuman'];
        let tahun_masuk = payload['tahun_masuk'];

        // transaction
        const connection = getConnection()
        const queryRunner = connection.createQueryRunner()

        // start transaction
        await queryRunner.startTransaction()
        try {

            const query = await this.getOrmRepository(DataStudi)
                .createQueryBuilder('ds')
                .select(['ds.*', 'u.nama_lengkap as nama_lengkap'])
                .leftJoin(User, 'u', 'u.id = ds.id')
                .where('ds.id =:id', {
                            id: id
                        })
            const checkmany = await query.getRawMany()
            
            if (!checkmany.length) {
                return this.resultRepository({}, 'Maaf, id tidak ada', 204)
            }

            await this.getOrmRepository(DataStudi).createQueryBuilder('ds')
                        .select(['ds.id as id'])
                        .where('ds.id =:id', {
                            id: id
                        })
                        .getRawOne() 

            // update data socmed
            let PayloadUpdatedDataStudi = {
                user_id: user_id,
                npm: npm,
                jurusan: jurusan, 
                sks: sks, 
                ipk_lokal: ipk_lokal, 
                ipk_utama: ipk_utama, 
                rangkuman: rangkuman, 
                tahun_masuk: tahun_masuk
            }
            
            await queryRunner.manager.update(DataStudi, {
                id: id
            }, PayloadUpdatedDataStudi)


            // Transaction commit
            await queryRunner.commitTransaction();

            return this.resultRepository(PayloadUpdatedDataStudi)

        } catch (err) {
            await queryRunner.rollbackTransaction(); // Transaction roolback
            return this.resultErrorRepository(err)       
        } finally {
            await queryRunner.release(); // Transaction release
        }
    }
}