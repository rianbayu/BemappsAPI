import { Service as MoleculerService } from 'moleculer';
import { Action, Service } from 'moleculer-decorators';
import { getConnection } from 'typeorm';
import { FaqRepositories } from '@Repositories';
import connectionInstance from '@Entities/Connection';
const BaseService = require("luriz_api_shared/services/base.service");

@Service({
	name: 'faq',
	mixins: BaseService
})

export class FaqService extends MoleculerService {
    private repo?:FaqRepositories;
	
	public async started() {
		var connection = await connectionInstance()
		this.repo = new FaqRepositories()
		this.setRepository(this.repo)
        return connection
	}

	@Action({
		cache: false
	})
	public async list(ctx: any): Promise<any> {
		const result = await this.repo!.list(ctx.params)			
		return this.response(result)
		// return result
	}

	@Action({
		cache: false
	})
	public async findId(ctx: any): Promise<any> {
		const result = await this.repo!.FaqFindId(ctx.params, ctx.params.id)
		return this.response(result)
		// return result
	}

	@Action({
		// params: {
		// 	email: {
		// 		type: 'string',
		// 		optional: false
		// 	},
		// },

		cache: false
	})
	public async add(ctx: any): Promise<any> {
		const result = await this.repo!.add(ctx.params)			
		return this.response(result)
	}

    @Action({
		cache: false
	})
	public async update(ctx: any): Promise<any> {
		const result = await this.repo!.UpdateFaq(ctx.params)			
		return this.response(result)
		// return result
	}

	@Action({
		cache: false
	})
	public async delete(ctx: any): Promise<any> {
		const result = await this.repo!.delete(ctx.params)			
		return this.response(result)
		// return result
	}

	public async stopped() {
		return await getConnection().close();
	}
}

module.exports = FaqService;