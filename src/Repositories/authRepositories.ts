import { User } from '@Entities';
import { BaseRepositories } from 'luriz_api_shared/repositories/BaseRepositories'
import { getConnection, getManager } from 'typeorm';
import { TransporterApi } from "luriz_api_shared/services/transporter.service"
import { BaseHelper } from 'luriz_api_shared/helper/BaseHelper'
import e from 'express';
const Password = require("node-php-password");
const MainHelper = new BaseHelper()
const moment = require('moment-timezone')
export class AuthRepositories extends BaseRepositories {

    private static instance: AuthRepositories;
    endPage: any;

    public static getInstance(): AuthRepositories {
        if (!AuthRepositories.instance) {
            AuthRepositories.instance = new AuthRepositories();
        }

        return AuthRepositories.instance;
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
                .select(['username','email', 'password', 'nama_lengkap', 'no_hp', 'id_line'])
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

    // ADD Auth DATA
    public async add(payload: any): Promise<any> {

        // params variable 
        let nama_lengkap = payload['nama_lengkap'];
        let panggilan = payload['panggilan'];
        let username = payload['username'];
        let password = payload['password'];
        let email = payload['email'];
        let no_hp = payload['no_hp'];
        let id_line = payload['id_line'];

        // transaction
        const connection = getConnection()
        const queryRunner = connection.createQueryRunner()

        // start transaction
        await queryRunner.startTransaction()

        try {

            let query = await this.getOrmRepository(User).createQueryBuilder('u')
                .select(['u.email as email'])
                .where('u.email =:email', {
                    email: email
                })
                .getCount()

            if (query > 0) {
                return this.resultRepository({}, 'Maaf, email sudah terdaftar ', 204)
            }

            let dataUser = new User()
            let hash = Password.hash(password)
            dataUser.username = username
            dataUser.password = hash
            dataUser.email = email
            dataUser.nama_lengkap = nama_lengkap
            dataUser.panggilan = panggilan
            dataUser.no_hp = no_hp
            dataUser.id_line = id_line

            // insert to blog_counter
            let insert = await queryRunner.manager.save(User, dataUser)

            // Transaction commit
            await queryRunner.commitTransaction();

            return this.resultRepository(insert, null, 201)

        } catch (err) {
            return this.resultErrorRepository(err)

        }
    }

    public async login_user(params: any) {

        // body req payload
        let username = params.username
        let password = params.password

        try {
            
            const query = await this.getOrmRepository(User).createQueryBuilder('u')
            .select(['u.username as username', 'u.password as password'])
            .where('u.username =:username', {
                username: username
            })
            .getRawOne()

            let usernamecheck = await this.getOrmRepository(User).createQueryBuilder('u')
            .select(['u.username as username'])
            .where('u.username =:username', {
                username: username
            })

            let querySelect = await this.getOrmRepository(User).createQueryBuilder('u')
                .select(['u.*'])
                .where('u.username =:username', {
                    username: username
                })
            .getRawOne()

            let queryResult = await usernamecheck.getRawMany()

            if (!queryResult.length) {
                return this.resultRepository({}, "Akun tidak ada", 204)
            }

            var hash = query.password

            if (query) {
                if(Password.verify(password, hash)){
                    return this.resultRepository(querySelect, "Login Success")
                } else{
                    return this.resultRepository({}, "password tidak cocok", 204)
                }
            } else {
                return this.resultRepository({}, "akun tidak ada", 204)
            }

        } catch (err) {
            return this.resultErrorRepository(err)       
        } 
    }
}