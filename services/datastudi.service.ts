import { Service as MoleculerService } from 'moleculer';
import { Action, Service } from 'moleculer-decorators';
import { getConnection } from 'typeorm';
import { DataStudiRepositories } from '@Repositories';
import connectionInstance from '@Entities/Connection';
const BaseService = require("luriz_api_shared/services/base.service");

@Service({
	name: 'datastudi',
	mixins: BaseService
})

export class DataStudiService extends MoleculerService {
    private repo?:DataStudiRepositories;
	
	public async started() {
		var connection = await connectionInstance()
		this.repo = new DataStudiRepositories()
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
		const result = await this.repo!.datastudiFindId(ctx.params, ctx.params.id)
		return this.response(result)
		// return result
	}

	@Action({
		cache: false
	})
	public async add(ctx: any): Promise<any> {
		const result = await this.repo!.add(ctx.params)			
		return this.response(result)
		// return result
	}

	@Action({
		cache: false
	})
	public async updateStudi(ctx: any): Promise<any> {
		const result = await this.repo!.updateDataStudi(ctx.params)			
		return this.response(result)
		// return result
	}

	public async stopped() {
		return await getConnection().close();
	}
}

module.exports = DataStudiService;