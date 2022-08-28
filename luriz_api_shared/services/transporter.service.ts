import {ApiService} from "./api.service"

export class  TransporterApi  {
    private api: ApiService;
    constructor(ServiceUrl:string) {
        
        var AxiosRequestConfig = {
            timeout: 2000,
			baseURL: ServiceUrl,
			headers:{
				'Authorization': String(process.env.SECRET_KEY)
			}
        };
        this.api = new ApiService(AxiosRequestConfig)                
    }
    public async apiRequest(method:any,path:string,payload?:any,headers?:any): Promise <any>{

        const apiRequest = await this.api.request({
                method: method,
                url:path,
                data: payload,
                headers:headers
            })
            .then((result:any)=>{                            
                return result.data
            })
            .catch((err:any)=>{                                  
                if (err.response) {
                    return err.response.data    
                } else {
                    return err
                }						
            })         

        return apiRequest
    }        
}
