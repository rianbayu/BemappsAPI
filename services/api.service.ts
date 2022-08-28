//#region Global Imports
import { ServiceSchema, Errors } from 'moleculer';
import ApiGateway = require('moleculer-web');
import multer = require("multer");
const upload = multer();
require("dotenv").config()
import { LogService } from "luriz_api_shared/services/log.service"
import { MiddlewareService } from "luriz_api_shared/services/middleware.service"
const logService = new LogService()
const middlewareAuth = new MiddlewareService()

const ApiService: ServiceSchema = {
	name: 'api',
	mixins: [ApiGateway],
	settings: {
		port: process.env.PORT || 5000,
		path: '/api',
		routes: [
			// Auth
			{
				path: '/auth',
				//mergeParams: false,
				aliases: {
					"GET /": "auth.authGet",
					"POST /": "auth.add",
					"POST /login": "auth.authLogin",
				},
				use: [
					//upload.none()
				],
				bodyParsers: {
					json: true
				},
				authorization: false,
				//authentication: true,
				//mappingPolicy: "restrict",
			},
			// Users
			{
				path: '/user',
				//mergeParams: false,
				aliases: {
					"GET /": "user.list",
					"GET /:id": "user.findId",
					"GET /pendingstatus": "user.pendinglist",
					"GET /truestatus": "user.truelist",
					"GET /falsestatus": "user.falselist",
					"GET /pendingakhir": "user.pendingakhir",

					"GET /listberkas": "user.berkaslist",
					"GET /pendingberkas": "user.berkaspendinglist",
					"GET /trueberkas": "user.berkastruelist",
					"GET /falseberkas": "user.berkasfalselist",

					"DELETE /": "user.delete",
					"PUT /userbiodata": "user.updateData",
					"PUT /userstatus": "user.status",
					"PUT /userstatusberkas": "user.statusberkas"
					// "POST /": "user.add",
				},
				use: [
					//upload.none()
				],	
				bodyParsers: {
					json: true
				},
				authorization: false,
				//authentication: true,
				//mappingPolicy: "restrict",
			},

			// Pilihan 
			{
				path: '/pilihan',
				//mergeParams: false,
				aliases: {
					"GET /": "pilihan.list",
					"GET /:id": "pilihan.findId",
					"POST /": "pilihan.add",
					"PUT /": "pilihan.update",
					"DELETE /": "pilihan.deletepil",
				},
				use: [
					//upload.none()
				],
				bodyParsers: {
					json: true
				},
				authorization: false,
				//authentication: true,
				//mappingPolicy: "restrict",
			},

			// DataStudi 
			{
				path: '/data-studi',
				//mergeParams: false,
				aliases: {
					"GET /": "datastudi.list",
					"GET /:id": "datastudi.findId",
					"POST /": "datastudi.add",
					"PUT /": "datastudi.updateStudi",
				},
				use: [
					//upload.none()
				],
				bodyParsers: {
					json: true
				},
				authorization: false,
				//authentication: true,
				//mappingPolicy: "restrict",
			},

			// FAQ 
			{
				path: '/faq',
				//mergeParams: false,
				aliases: {
					"GET /": "faq.list",
					"GET /:id": "faq.findId",
					"POST /": "faq.add",
					"PUT /": "faq.update",
					"DELETE /": "faq.delete",
				},
				use: [
					//upload.none()
				],
				bodyParsers: {
					json: true
				},
				authorization: false,
				//authentication: true,
				//mappingPolicy: "restrict",
			},

		],
		onError(req: any, res: any, err: any) {
			res.setHeader("Content-Type", "application/json; charset=utf-8");
			res.writeHead(err.code);
			let msg: any[] = []
			if (err.type === 'VALIDATION_ERROR') {
				err.data.forEach((el: any, i: any) => {
					msg[i] = el.message
				});
			} else {
				// err.message.push(msg)
				msg.push(err.message)
			}
			let obj = {
				code: err.code,
				status: 'error',
				message: msg,
				data: null,
			}
			var rst = JSON.stringify(obj)
			res.end(rst)
		},

		assets: {
			folder: 'public',
		},
	},
	methods: {
		async authorize(ctx: any, route: any, req: any, res: any): Promise<any> {
			return await middlewareAuth.authorize(req)
		},
		async authenticate(ctx: any, route: any, req: any, res: any): Promise<any> {
			return await middlewareAuth.authenticate(ctx, req)
		}
	}
};

export = ApiService;
