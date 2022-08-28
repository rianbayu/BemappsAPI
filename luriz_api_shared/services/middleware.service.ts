import { Errors } from 'moleculer';
import { TransporterApi } from "./transporter.service" 
require('dotenv').config({path: __dirname + '/../.env_shared'});

export class MiddlewareService{

	private transport:TransporterApi;
	constructor(){
		this.transport = new TransporterApi(String(process.env.SSO_SERVICE_URL)) // set service url
	}
	public async authenticate(ctx:any, req:any): Promise<any> {		
		
		let token;		
		let authorization = await this.authorize(req) // check authorize

		if (authorization) {
			
			if (req.headers.token) {
				let type = req.headers.token.split(" ")[0];
				if (type === "Token" || type === "Bearer")
					token = req.headers.token.split(" ")[1];
			}

			let resultApi:any;
			if (token) {
				try {
					let method = 'post'
					let path = 'auth/token/verify'
					let data = {
						token : token
					}
					resultApi = await this.transport.apiRequest(method,path,data)				
					
					if (resultApi.code === 200) {					
						ctx.meta.auth = resultApi.result //set user data to meta cookie						
					} else {				
						let ErrCode = !isNaN(resultApi.code) ? resultApi.code : 500
						return Promise.reject(new Errors.MoleculerError(`${resultApi.message} on auth service`,ErrCode));						
					}
				} catch (err) {
					if (err instanceof Error)
						return Promise.reject(new Errors.MoleculerError(err.message));
				}
			}
			else {
				return Promise.reject(new Errors.MoleculerError('Token Required', 401, 'authenticate'));
			}
		}
	}
	public authorize(req:any):any {

		var secret_token = req.headers.authorization
		const secret_key = process.env.SECRET_KEY

		if (secret_token !== undefined) {
			// Check the token
			if (secret_token !== secret_key) {			
				// Invalid token
				return Promise.reject(new Errors.MoleculerError('Invalid Authorization key', 404, 'authorize'));
			}
			return true
		} else {
			// No token
			return Promise.reject(new Errors.MoleculerError('Authorization required', 401, 'authorize'));
		}
	}
}	