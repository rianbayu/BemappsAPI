import {IBTransformer} from '@Interfaces'

export class BasicTransformers implements IBTransformer{
    constructor() {
        
    }
    dataParse(data:any){
        //transform data for response
        return data;
    }

    dataParses(data:any){
        //transform data for response
        for (const iterator of data) {
            //
        }
        return data;
    }   
}