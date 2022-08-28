"use strict";
import { Errors } from 'moleculer';
import { Any } from 'typeorm';
// import { BaseHelper } from '../helper/BaseHelper'
// const MainHelper = new BaseHelper()

class  BaseService {
	protected repo?: any ;	
	public setRepository(repo:any): void {
		this.repo = repo;
	}
	public getRepository(): any {
		return this.repo;
	}

	public async list(payload: any = {order:{}}): Promise<any> {										
		const result = await this.repo.search(payload)
		return this.response(result)			
		
	} 

	public async paginate(page: number=1, limit:number = 1, payload: any = {order:{}}): Promise<any> {
		return await this.repo.paginate(page, limit, payload)
	}

	public async create(payload: any): Promise<any> {
		return await this.repo.create(payload)
	}

	public async update(id: number, payload: any): Promise<any> {
		return await this.repo.update(id, payload)
	}
	public async findId(id: number): Promise<any> {
		const result = await this.repo.findById(id)
		return this.response(result)
	}
	public async findSlug(slug: string): Promise<any> {		
		const result = await this.repo.findBySlug(slug)
		return this.response(result)
	}	
	public async verify(token:string): Promise<any> {
		const result = await this.repo!.verifyToken(token);		
		return this.response(result)	
	}	
	public async response(data:any): Promise<any> {
			
		if(data.error){
			return Promise.reject(new Errors.MoleculerError(data.message,data.code,"error",data.data));
		}		
		return  {
				"code": data.code,				
				"status": true,
				"message": data.message,
				"result": data.data
			
		}
	}
}

let baseService = new BaseService()
var baseServices: Map<string,  BaseService>  = new Map()

module.exports = {
	name: "base",
	
	//baseService: baseService,
	settings: {
		//baseService: baseService,
	},
	created() {
		baseServices.set((this as any).name, new BaseService())  
	},
	queues: {
		"notif.send":  {
            name: 'mail',
            concurrency: 5,
            process(job:any):any {
                (this as any).logger.info("New job received! from job#", job.data.jobID);
                job.progress(10);
				
				(this as any).broker.call('notification.send',job.data) // call send mail service					

                return (this as any).Promise.resolve({
                    done: true,
                    id: job.data.id,
                    worker: process.pid,					
                });
            }
        }
    },
	/**
	 * Actions
	 */
	actions: {

		/**
		 * Say a 'Hello'
		 *
		 * @returns
		 */
		/*
		list(ctx) {
			baseService.list() 
			return "Hello Moleculer";
		},
		*/
		/**
		 * Welcome a username
		 *
		 * @param {String} name - User name
		 */		
		list: {
			
			async handler(ctx:any): Promise<any> {
				
				return await baseServices.get((this as any).name)!.list(ctx.params)
			}
		},
		findId: {
			params: {
				id: { type: "string" }
			},
			async handler(ctx:any) : Promise<any> {
				
				return await baseServices.get((this as any).name)!.findId(ctx.params.id)
			}
		},
		findSlug: {
			params: {
				slug: { type: "string" }
			},
			async handler(ctx:any) : Promise<any> {
				
				return await baseServices.get((this as any).name)!.findSlug(ctx.params.slug)
			}
		},
		verify:{
			cache: true,
			params:{
				token: {type:"string"}
			},
			async handler(ctx:any) : Promise<any>{				
				return await baseServices.get((this as any).name)!.verify(ctx.params.token)								
			}
		}
	},
	methods: {
		setRepository(repo: any) {
			baseServices.get((this as any).name)!.setRepository(repo)
		},

		getRepository(): any {
			return baseServices.get((this as any).name)!.getRepository()
		},
		response(data:any): any {
			
			return baseService.response(data)
		}
		
	}
	
};