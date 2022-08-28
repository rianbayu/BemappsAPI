import { Service as MoleculerService } from 'moleculer';
import { Action, Service } from 'moleculer-decorators';
import { getConnection } from 'typeorm';
import { UserRepositories } from '@Repositories';
import connectionInstance from '@Entities/Connection';
const BaseService = require("luriz_api_shared/services/base.service");

@Service({
	name: 'user',
	mixins: BaseService
})

export class UserService extends MoleculerService {
	private repo?: UserRepositories;

	public async started() {
		var connection = await connectionInstance()
		this.repo = new UserRepositories()
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
		const result = await this.repo!.UserFindId(ctx.params)
		return this.response(result)
	}

	// ONLY FIND

	@Action({
		cache: false
	})
	public async pendinglist(ctx: any): Promise<any> {
		const result = await this.repo!.UserPendingStatus(ctx.params)
		return this.response(result)
		// return result
	}

	@Action({
		cache: false
	})
	public async truelist(ctx: any): Promise<any> {
		const result = await this.repo!.UserTrueStatus(ctx.params)
		return this.response(result)
		// return result
	}

	@Action({
		cache: false
	})
	public async falselist(ctx: any): Promise<any> {
		const result = await this.repo!.UserFalseStatus(ctx.params)
		return this.response(result)
		// return result
	}

	@Action({
		cache: false
	})
	public async berkaslist(ctx: any): Promise<any> {
		const result = await this.repo!.berkasListAll(ctx.params)
		return this.response(result)
		// return result
	}
	@Action({
		cache: false
	})
	public async berkaspendinglist(ctx: any): Promise<any> {
		const result = await this.repo!.berkasPendingStatus(ctx.params)
		return this.response(result)
		// return result
	}
	@Action({
		cache: false
	})
	public async berkastruelist(ctx: any): Promise<any> {
		const result = await this.repo!.berkasTrueStatus(ctx.params)
		return this.response(result)
		// return result
	}
	@Action({
		cache: false
	})
	public async berkasfalselist(ctx: any): Promise<any> {
		const result = await this.repo!.berkasFalseStatus(ctx.params)
		return this.response(result)
		// return result
	}

	// END ONLY

	@Action({
		cache: false
	})
	public async updateData(ctx: any): Promise<any> {
		const result = await this.repo!.updateUserBiodata(ctx.params)
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

	@Action({
		cache: false
	})
	public async statusberkas(ctx: any): Promise<any> {
		const result = await this.repo!.statusUsersBerkas(ctx.params)
		return this.response(result)
		// return result
	}

	@Action({
		cache: false
	})
	public async status(ctx: any): Promise<any> {
		const result = await this.repo!.statusUsers(ctx.params)
		return this.response(result)
		// return result

	}

	@Action({
		cache: false
	})
	public async pendingakhir(ctx: any): Promise<any> {
		const result = await this.repo!.pendingAkhirList(ctx.params)
		return this.response(result)
		// return result

	}

	public async stopped() {
		return await getConnection().close();
	}
}

module.exports = UserService;