//import { EntityManager, getManager, QueryRunner, getConnection, DeleteResult, UpdateResult, Connection } from 'typeorm';
//import { DeleteResult, UpdateResult } from 'typeorm';
//import { IBTransformer } from '@Interfaces'
//import { MainHelper } from '@ServiceHelpers'
require("dotenv").config()
import { Redis } from '../redis/config'
import { BaseHelper } from '../helper/BaseHelper'
const MainHelper = new BaseHelper()
export class BaseRepositories {

    // private static instance: BaseRepositories;
    protected manager?: any //= getManager()
    protected entities?: any
    protected transformer?: any
    protected connectionManager?: any
    private queryRunner?: any //= getConnection().createQueryRunner()
    protected connection?: Map<string, any> = new Map()

    public constructor(entities: any) {
        this.entities = entities
    }
    public setManager(manager: any) {
        this.manager! = manager
    }
    public setConnection(connection: any, name: string = 'default') {
        this.connection!.set(name, connection)
    }
    public setQueryRunner(connectionName: string = 'default') {
        return this.queryRunner = this.connection!.get(connectionName).createQueryRunner()
    }
    public setConnectionManager(getConnectionManager: any, connectionName: string) {
        return this.connectionManager = getConnectionManager.get(connectionName)
    }
    public getRepoConnections(entity: any): any {
        return this.connectionManager.getRepository(entity)
    }
    public getConnection(name: string = 'default'): any {
        return this.connection!.get(name)
    }
    public getOrmRepository(entity: any, connectionName: string = 'default'): any {
        return this.connection!.get(connectionName).getRepository(entity)
    }

    public async rawQuery(sqlStr: string): Promise<any> {
        return this.manager!.query(sqlStr)
    }
    public async get_All(payload: any, doTransform: boolean = true, entity?: any): Promise<any> {
        if (typeof (entity) === 'undefined' && entity == null) entity = this.entities
        var response = await this.manager!.find(entity, payload)
        if (response !== null && (this.transformer != null && this.transformer !== null && typeof this.transformer !== 'undefined') && doTransform) {
            response = await this.transformer!.dataParse(response)
        }

        return response
    }
    public async get_one(payload: any, doTransform: boolean = true, entity?: any): Promise<any> {
        if (typeof (entity) === 'undefined' && entity == null) entity = this.entities
        var response = await this.manager!.findOne(entity, payload)
        if (response !== null && (this.transformer != null && this.transformer !== null && typeof this.transformer !== 'undefined') && doTransform) {
            response = await this.transformer!.dataParse(response)
        }

        return response
    }
    public async findById(id: number, doTransform: boolean = true, entity?: any): Promise<any> {
        if (typeof (entity) === 'undefined' && entity == null) entity = this.entities
        var response = await this.get_one({ id: id }, doTransform, entity)

        return this.resultRepository(response)
    }
    public async findBySlug(slug: string, doTransform: boolean = true, entity?: any): Promise<any> {
        if (typeof (entity) === 'undefined' && entity == null) entity = this.entities
        var response = await this.get_one({ slug: slug }, doTransform, entity)

        return this.resultRepository(response)
    }
    public async search(payload: any, doTransform: boolean = true, entity?: any): Promise<any> {
        let take: number = payload!['limit'] || 10
        let page: number = payload!['page'] || 1
        let order: Map<String, any> = payload!['order'] || {}
        let where: Map<String, any> = payload!['where'] || {}

        var response = this.paginate(page, take, where, order, doTransform, entity)
        return response
    }

    public async paginate(page: number = 1, limit: number = 10, payloadWhere: Map<String, any>, order: Map<String, any>, doTransform: boolean = true, entity?: any): Promise<any> {
        let data = {}
        if(limit == 0) {
            if (typeof (entity) === 'undefined' && entity == null) entity = this.entities
            let [result, total] = await this.manager!.findAndCount(entity,
                {
                    where: payloadWhere,
                    order: order
                }
            );
            let data = {
                count: total,
                data: result
            }
        } else {
            const skip: number = (page - 1) * limit
            if (typeof (entity) === 'undefined' && entity == null) entity = this.entities
            let [result, total] = await this.manager!.findAndCount(entity,
                {
                    where: payloadWhere,
                    take: limit,
                    skip: skip,
                    order: order
                }
            );
            if (result !== null && (this.transformer != null && this.transformer !== null && typeof this.transformer !== 'undefined') && doTransform) {
                result = await this.transformer!.dataParses(result)
            }
    
            let data = {
                count: total,
                pages: Math.ceil(total / limit),
                page: page,
                limit: limit,
                data: result
            }
        }
        

        return this.resultRepository(data)
    }
    public async queryBuilderList(payload: any, entity: any): Promise<any> {

        let take: number = payload!['limit'] || 10
        let page: number = payload!['page'] || 1
        let name: string = payload!['name']
        let order: string = payload!['order'] || 'created_at'
        let sort: string = payload!['sort'] || 'DESC'

        var dataTransform: any = []
        let data: any = []
        const skip: number = (page - 1) * take
        try {
            var query = await this.getOrmRepository(entity).createQueryBuilder()

            if (name) {
                name = name.toUpperCase()
                query = query.where("name like :name", { name: `%${name}%` })
            }
            query.offset(skip)
                .limit(take)
                .orderBy(order, sort.toUpperCase())

            let total = await query.getCount()
            let queryResult = await query.getMany()

            if (total > 0) {
                dataTransform = await this.doTransform(queryResult)
                data = {
                    count: total,
                    pages: Math.ceil(total / take),
                    page: page,
                    limit: take,
                    data: dataTransform
                }
            }
            return data
        } catch (err) {
            return this.resultErrorRepository(err)
        }
    }
    public async queryBuilderId(id: number, entity: any): Promise<any> {

        try {
            var query = await this.getOrmRepository(entity).createQueryBuilder()
                .where("id=:id", { id: id })
                .getOne()

            return query
        } catch (err) {
            return this.resultErrorRepository(err)
        }
    }
    public async doTransform(data: any): Promise<any> {

        if (Array.isArray(data))
            data = await this.transformer!.dataParses(data)
        else
            data = await this.transformer!.dataParse(data)

        return data
    }

    public setTransformer(transfomer: any): void {
        this.transformer = transfomer
    }

    public async beginTransaction(): Promise<void> {
        return this.queryRunner!.startTransaction();
    }
    public async commit(): Promise<void> {
        return this.queryRunner!.commitTransaction();
    }
    public async rollback(): Promise<void> {
        return this.queryRunner!.rollbackTransaction();
    }
    public async release(): Promise<void> {
        return this.queryRunner!.release();
    }
    public async insertTransaction(data: any, entity?: any, doTransform?: any): Promise<any> {
        if (typeof (entity) === 'undefined' && entity == null) entity = this.entities
        let response = await this.queryRunner.manager.save(entity, data)

        if (response !== undefined && this.transformer !== null && doTransform) {
            response = await this.transformer!.dataParse(response)
        }

        return response
    }

    public async updateTransaction(param: any, data: any, entity?: any): Promise<any> {
        if (typeof (entity) === 'undefined' && entity == null) entity = this.entities
        let response = await this.queryRunner.manager.update(entity, param, data)

        return response
    }

    public async delete(payload: Map<String, String>, entity?: any): Promise<any> {
        if (typeof (entity) === 'undefined' && entity == null) entity = this.entities
        return await this.manager!.delete(entity, payload)
    }
    public async deleteById(id: number, entity?: any): Promise<any> {
        if (typeof (entity) === 'undefined' && entity == null) entity = this.entities
        return await this.manager!.delete(entity, { id: id })
    }
    public async create(data: any, entity?: any): Promise<any> {
        if (typeof (entity) === 'undefined' && entity == null) entity = this.entities
        return await this.manager.save(entity, data)
    }
    public async customUpdate(params: any, data: any, entity?: any): Promise<any> {
        if (typeof (entity) === 'undefined' && entity == null) entity = this.entities
        return await this.manager!.update(entity, params, data)
    }
    public async update(id: number, data: any, entity?: any): Promise<any> {
        if (typeof (entity) === 'undefined' && entity == null) entity = this.entities
        return await this.manager!.update(entity, { id: id }, data)
    }
    public resultRepository(data: any, message?: any, code?: number, errorOnEmpty: boolean=true): any {
        let result = { error: false, data: data, message: message || "retrieve data success", code: code || 200 }
        if ((!data || data.length === 0) && errorOnEmpty) {
            return this.resultErrorRepository(message, 404)
        }

        return result
    }
    public resultErrorRepository(err?: any, code?: number): any {
        let result = { error: true, data: null, message: err || 'data not found', code: code || 500 }

        if (err instanceof Error) {
            result.message = err.message
        }

        return result
    }
    public async verifyToken(token: string): Promise<any> {       
        const decoded = await this.getSession(token)
        if (!decoded) {
            return this.resultErrorRepository('token not found', 404)
        }
        return this.resultRepository(decoded)
    }
    public setSession(keys: any, data: any) {
        // return keys
        Redis.cacher?.set(keys.accessToken, data, Number(process.env.ACCESS_TOKEN_EXP)) //set accessToken
        Redis.cacher?.set(`rft:${keys.resfreshToken}`, data, Number(process.env.ACCESS_TOKEN_EXP)) //set RefreshToken

        this.setCodeSession(keys.code, { // set session code 1 time use
            accessToken: keys.accessToken,
            resfreshToken: keys.resfreshToken,
        })

        Redis.cacher?.set(`device-userId:${data.id}`, '', Number(process.env.ACCESS_TOKEN_EXP)) //set device session by userId

        return true
    }
    public setCodeSession(code: any, value: any) {
        Redis.cacher?.set(`code:${code}`, value, 3600) //set unique code one time use
        return true
    }
    public setdeviceSession(userId: any, value: any) {
        Redis.cacher?.set(`device-userId:${userId}`, value) //set unique code one time use
        return true
    }
    public SessionClear(key:string) {
        Redis.cacher?.clean(key) // clear key from redis
        return true
    }
    public async bcaAccessToken(data: any) {
        return await Redis.cacher?.set('bca-key', data, 2700) //set accessToken bca, ttl 45 minutes
    }
    public async bcaLengthSess(data: number) {
        return await Redis.cacher?.set('bca-length', data, 3600) //set length data response bca, ttl 60 minutes
    }
    public async getSession(key: string) {
        return await Redis.cacher?.get(key)
    }
    public async destroySession(key: string) {
        return await Redis.cacher?.del(key)
    }
    public async paginationNumber(page: number = 1, limit: number = 10, payloadWhere: Map<String, any>, order: Map<String, any>, basePath: string, doTransform: boolean = true, entity?: any): Promise<any> {


        const skip: number = (page - 1) * limit
        if (typeof (entity) === 'undefined' && entity == null) entity = this.entities
        let [result, total] = await this.manager!.findAndCount(entity,
            {
                where: payloadWhere,
                take: limit,
                skip: skip,
                order: order
            }
        );

        if (result !== null && (this.transformer != null && this.transformer !== null && typeof this.transformer !== 'undefined') && doTransform) {
            result = await this.transformer!.dataParses(result)
        }

        //pagination
        let ttlPages: number = Math.ceil(total / limit)
        let pageNumber = []
        let arr: number = page - 5
        if (arr > 0) {
            var strt: number = arr
        } else {
            var strt: number = 1
        }
        for (let i = strt; i <= ttlPages; i++) {
            let row: any = {}

            row.number = i //number
            row.url = `${basePath}?page=${i}&limit=${limit}` //url
            row.status = page == i ? true : false //status
            if (row.status == true) {
                var first: any = `${basePath}?page=1&limit=${limit}`
                if (i != 1)
                    var prev: any = `${basePath}?page=${page - 1}&limit=${limit}`
                if (i != ttlPages)
                    var next: any = `${basePath}?page=${i + 1}&limit=${limit}`
            }
            pageNumber.push(row)

        }

        if (result.length) {
            let data = {
                count: total,
                pages: Math.ceil(total / limit),
                page: page,
                limit: limit,
                page_first: first,
                page_prev: prev,
                page_array: pageNumber.slice(0, 11),
                page_next: next,
                page_last: pageNumber[pageNumber.length - 1].url,
                data: result
            }
            return data
        }


    }
}