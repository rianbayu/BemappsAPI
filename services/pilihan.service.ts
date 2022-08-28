import { Service as MoleculerService } from 'moleculer';
import { Action, Service } from 'moleculer-decorators';
import { getConnection } from 'typeorm';
import { PilihanRepositories } from '@Repositories';
import connectionInstance from '@Entities/Connection';
const BaseService = require("luriz_api_shared/services/base.service");

@Service({
	name: 'pilihan',
	mixins: BaseService
})

export class PilihanService extends MoleculerService {
	private repo?: PilihanRepositories;

	public async started() {
		var connection = await connectionInstance()
		this.repo = new PilihanRepositories()
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
		const result = await this.repo!.pilihanFindId(ctx.params, ctx.params.id)
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
	public async update(ctx: any): Promise<any> {
		const result = await this.repo!.UpdatePilihan(ctx.params)
		return this.response(result)
		// return result
	}

	@Action({
		cache: false
	})
	public async deletepil(ctx: any): Promise<any> {
		const result = await this.repo!.deletePilihan(ctx.params)
		return this.response(result)
	}

	// BERKASSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS

	public async stopped() {
		return await getConnection().close();
	}
}

module.exports = PilihanService;