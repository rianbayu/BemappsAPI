require("dotenv").config()
const otpGenerator = require('otp-generator')
const TokenGenerator = require('uuid-token-generator');
const { v4: uuidv4 } = require('uuid');
const datetime = new Date();
var jwt = require('jsonwebtoken');
const moment = require('moment-timezone')
const extractNumbers = require('extract-numbers')

export class BaseHelper {
	
	public async expiredCheck(data:any): Promise<any> { //expire check  helper
		var response = true
		if (data < datetime) { // if data time less than current timestamp
			response = false
		}
		return response
	}
	public priceFormat(data:number){
		return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
	public async generateUniqueId():Promise<any>{ //generate unique id
		const uuid = uuidv4({
			node: [0x01, 0x23, 0x45, 0x67, 0x89, 0xab],			
			msecs: datetime.getTime(),		
		})
		return uuid
	}
	public async generateRandomOtp():Promise<any>{ // generate Otp
        const otp = otpGenerator.generate(4, { upperCase: false, digits: true, alphabets: false, specialChars: false });
		return otp
    }    
	public async generateToken():Promise<any>  { //generate unique id
		const tokgen = new TokenGenerator(512, TokenGenerator.BASE62);
		return tokgen.generate();
	}
	public async verifyAccessToken(token:string):Promise<any> { //generate unique id
		const checkToken = jwt.verify(token, process.env.ACCESS_TOKEN_SALT); // verify token
		let epDate = checkToken.exp * 1000
		let transformTo = await this.parseTime(epDate)
		let dataObject = {
			id: checkToken.user_id,
			email: checkToken.user_email,
			exp: transformTo
		}

		return dataObject

	}
	public async verifyRefreshToken(token:string):Promise<any> { //generate unique id
		const checkToken = jwt.verify(token, process.env.REFRESH_TOKEN_SALT); // verify token
		let epDate = checkToken.exp * 1000
		let transformTo = await this.parseTime(epDate)
		let dataObject = {
			id: checkToken.user_id,
			exp: transformTo
		}

		return dataObject
	}
	public async generateAccessToken(dataUser:any):Promise<any>{ //generate accessToken

		var response = {}
        let accessToken = jwt.sign(dataUser, process.env.ACCESS_TOKEN_SALT);

        let resfreshToken = jwt.sign(dataUser, process.env.REFRESH_TOKEN_SALT);

		response = {accessToken,resfreshToken}

		return response
    }
	public async parseTime(data:number):Promise<any> { 
		let dataTransform = moment(data).format('YYYY-MM-DD HH:mm:ss')

		return dataTransform
	}
	public async setExpire(data:number):Promise<any> { 
		var setTime = moment(new Date).add(data, 'minutes');  		
		return setTime
	}
	public async setPrevOrNextDate(data:number,date?:string):Promise<any> { 
		let setDate = moment(date).add(data, 'days').format('YYYY-MM-DD')
		return setDate
	}
	public async currenDate(date?:string):Promise<any> { 
		return moment(date).format('YYYY-MM-DD')		
	}
	public async currenDateTime(date?:string):Promise<any> { 
		return moment(date).format('YYYY-MM-DD HH:mm:ss')		
	}
	public async ThrowErroHandler(message:string,code:number):Promise<any> {

		let erObj = {
			msg: message,
			code: code
		}
		return new Error(JSON.stringify(erObj))		
	}
	public async ParseErroHandler(params:string):Promise<any>{
		try {
			return JSON.parse(params)
		} catch (e) {
			return params
		}
		
	}
	public isNull(checkVar:any): boolean{
		return checkVar == null || checkVar === null ||  typeof checkVar === 'undefined'? true: false
		
	}
	public isEmpty(checkVar:any): boolean{		
		return Object.keys(checkVar).length === 0 && checkVar.constructor === Object ? true : false
	}
	public isNumeric(data:any):boolean {		
		let response = true

		if (isNaN(data)) {
			response = false
		}

		return response
	}
	public getNumberFromString(data:any):any{								
		let response;
		let arrData = extractNumbers(data) //get all numeric on string
		if (arrData.length > 1) {
			response = arrData.filter((el:any) => el.length > 5); //only 6 digit numeric 
		}else{
			response = arrData
		}
		response = response.map((el:any) => Number(el))

		return response[0]
	}
	// public async getUserFromRedis(data:any): Promise<any>{
    //     return new Promise((resolve, reject) => {
    //         redisClient.get(data, (err: any, res: any) => {
    //             if (err) reject(err);
    //             else resolve(res);
    //         });
    //     });
    // }
	// public async storeUserToRedis(key:any,data:any): Promise<any>{
    //     return redisClient.set(`user:${key}`,data);
    // }
	public async ObjToStrQuery(obj:any): Promise<any>{		
		return Object.keys(obj).map(key => key + '=' + obj[key]).join(' and ');        
	}
	public async ObjToStrOrder(obj:any): Promise<any>{		
		return Object.keys(obj).map(key => key + ' ' + obj[key]).join(',');        
	}	
	public async videoThumbnail(data:string): Promise<any>{
		let strSplit = data.split('/')
		let IdVid 	 = strSplit[strSplit.length - 1]		

		var imgUrl = `https://images.dacast.com/137797/tf-${IdVid}-4.png?1638180739`		

		return imgUrl
	}
	public async generateBcaToken(params:any): Promise<any>{
		return Buffer.from(`${params.client_id}:${params.client_secret}`).toString('base64') // generate client id and secret to create token		
	}
	public getKeyByValue(object:any, value:any) {		
		return Object.keys(object).find(key => object[key] === value);
	}
	public getValueByKey(object:any, value:any) {						
		return Object.values(object).find(key => object[value] === key);
	}
	public ErpStatusOrder(value:string){		

		let objStatus = {
			'3' : 'Allocated',
			'4' : 'Handover 3PL',
			'5' : 'Accepted',
			'6' : 'Closed',
			'8' : 'Canceled',			
		}

		return this.getKeyByValue(objStatus,value)
	}
	public course_order(value:any) {
		let obj = {'latest':'c.created_at', 'rating':'rating','price':'c.price','popular':'popular'}
		return this.getValueByKey(obj,value)
	}
	public order_status(value:any) {
		let obj = {
				'1':'Menunggu Pembayaran', 
				'2':'Pesanan Dibayarkan',
				'3':'Pesanan Diproses', 
				'4':'Pesanan Dikirim',
				'5':'Pesanan Diterima', 
				'6':'Pesanan Selesai',
				'7':'Pesanan Dikomplain', 
				'8':'Pesanan Dibatalkan'
			}
			return this.getValueByKey(obj,value)
	}
	public course_level(value:any) {
		let obj = {
				'1':'beginner', 					
				'2':'advanced', 				
				'3':'intermediate',
			}
			return this.getKeyByValue(obj,value)
	}
}