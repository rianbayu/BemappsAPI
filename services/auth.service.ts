import { Service as MoleculerService } from 'moleculer';
import { Action, Service } from 'moleculer-decorators';
import { getConnection } from 'typeorm';
import { AuthRepositories } from '@Repositories';
import connectionInstance from '@Entities/Connection';
const BaseService = require("luriz_api_shared/services/base.service");

@Service({
	name: 'auth',
	mixins: BaseService
})

export class AuthService extends MoleculerService {
    private repo?:AuthRepositories;
	
	public async started() {
		var connection = await connectionInstance()
		this.repo = new AuthRepositories()
		this.setRepository(this.repo)
        return connection
	}

	@Action({
		cache: false
	})
	public async authGet(ctx: any): Promise<any> {
		const result = await this.repo!.list(ctx.params)			
		return this.response(result)
		// return result
	}

	@Action({
		// Required Field
		params: {
			username: {
				type: 'string',
				optional: false
			},
			email: {
				type: 'string',
				optional: false
			},
			password: {
				type: 'string',
				optional: false
			},
		},

		cache: false
	})
	public async add(ctx: any): Promise<any> {
		const result = await this.repo!.add(ctx.params)
		return this.response(result)
	}


	@Action({
		cache: false
	})
	public async authLogin(ctx: any): Promise<any> {
		const result = await this.repo!.login_user(ctx.params)			
		return this.response(result)
		// return result
	}

	public async stopped() {
		return await getConnection().close();
	}
}

module.exports = AuthService;