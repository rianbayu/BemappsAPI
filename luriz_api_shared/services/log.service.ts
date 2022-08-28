import {ApiService} from "./api.service"


export class  LogService  {
    private api: ApiService;
    constructor() {
        
        var AxiosRequestConfig = {
            timeout: 20000,
            baseURL: process.env.URL_LOG_SERVICE ?? "http://staging-gateway.bakingworld.id/api/"
        };
        this.api = new ApiService(AxiosRequestConfig)
        
        //this.setToken = setToken
    }    
    public async info(service: string, message: string, short_message: string, other_data?: any): Promise<void> {
        await this.api.post('log/info', {
			service: service,
			short_message: short_message,
			message: message,
		  })
    }
    public async error(service: string, message: string, short_message: string, other_data?: any): Promise<void> {
        await this.api.post('log/error', {
			service: service,
			short_message: short_message,
			message: message,
		  })
    }
    public async warning(service: string, message: string, short_message: string, other_data?: any): Promise<void> {
        await this.api.post('log/error', {
			service: service,
			short_message: short_message,
			message: message,
		  })
    }
}
