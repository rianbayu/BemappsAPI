import { Faq, User } from '@Entities';
import { BaseRepositories } from 'luriz_api_shared/repositories/BaseRepositories'
import { getConnection, getManager } from 'typeorm';
import { TransporterApi } from "luriz_api_shared/services/transporter.service"
import { BaseHelper } from 'luriz_api_shared/helper/BaseHelper'
const MainHelper = new BaseHelper()
const moment = require('moment-timezone')
export class FaqRepositories extends BaseRepositories{

    private static instance: FaqRepositories;
    endPage:any;

    public static getInstance(): FaqRepositories {
        if (!FaqRepositories.instance) {
            FaqRepositories.instance = new FaqRepositories();
        }

        return FaqRepositories.instance;
    }

    constructor() {
        super(Faq)
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

           let query = await this.getOrmRepository(Faq).createQueryBuilder('fq')   
                    .select(['fq.*', 'u.nama_lengkap as nama_lengkap'])  
                    .leftJoin(User, 'u', 'u.id = fq.user_id')
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

    public async FaqFindId(params: any, id: number): Promise<any> {

        try {
            const query = await this.getOrmRepository(Faq)
                .createQueryBuilder('fq')
                .select(['fq.*', 'u.nama_lengkap as nama_lengkap'])
                .leftJoin(User, 'u', 'u.id = fq.user_id')
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
        let user_id = payload ['user_id'];
        let komentar = payload ['komentar'];
        let status = payload ['status'];

        // transaction
        const connection = getConnection()
        const queryRunner = connection.createQueryRunner()

        // start transaction
        await queryRunner.startTransaction()

        try {
            // GET ID FROM tbl_users
            let queryData = await this.getOrmRepository(User).createQueryBuilder('u')   
                    .select(['u.id as user_id'])  
                    .where('u.id =:user_id',{
                        user_id:user_id
                    })
                    .getRawMany()

            if (!queryData.length) {
                return this.resultRepository({}, 'Maaf, id tidak ada ', 204)
            }

            let dataFaq = new Faq()
            dataFaq.user_id   = user_id
            dataFaq.komentar  = komentar
            dataFaq.status    = status
            
            // insert to blog_counter
            let insert = await queryRunner.manager.save(Faq, dataFaq)    

            // Transaction commit
            await queryRunner.commitTransaction();

            return this.resultRepository(insert, null, 201)

        } catch (err) {
            return this.resultErrorRepository(err)

        }
    }

    public async UpdateFaq(payload: any): Promise<any> {

        // body req payload
        let id = payload['id']
        let jawaban = payload ['jawaban'];
        let status = payload ['status'];

        // transaction
        const connection = getConnection()
        const queryRunner = connection.createQueryRunner()

        // start transaction
        await queryRunner.startTransaction()
        try {

            await this.getOrmRepository(Faq).createQueryBuilder('fq')
                        .select(['fq.id as id'])
                        .where('fq.id =:id', {
                            id: id
                        })
                        .getRawOne() 

            // update data socmed
            let PayloadUpdatedFaq = {
                jawaban: jawaban,
                status: status,
            }
            
            await queryRunner.manager.update(Faq, { // update fb_share + 1
                id: id
            }, PayloadUpdatedFaq)


            // Transaction commit
            await queryRunner.commitTransaction();

            return this.resultRepository(PayloadUpdatedFaq)

        } catch (err) {
            await queryRunner.rollbackTransaction(); // Transaction roolback
            return this.resultErrorRepository(err)       
        } finally {
            await queryRunner.release(); // Transaction release
        }
    }

    public async deleteFaq(params:any) {           
        
        let id = params.id 
        let user_id = params.user_id
                
        try {                                   
                                  
            let query = await this.getOrmRepository(Faq).findOne({
                where: {
                    id: id,
                    user_id: user_id
                }
            })

            if (!query) {
                return this.resultErrorRepository('denied for this address',401)       
            }                                                                                   
            
            let dataObject = {
                id:id,
                user_id:user_id
            }            
                                
            return this.resultRepository(dataObject,'delete success')
        
        } catch (err) {            
            return this.resultErrorRepository(err)       
        }
    }
}