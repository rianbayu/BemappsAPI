//#region Global Imports
import { createConnection, Connection } from 'typeorm';
require("dotenv").config()
//#endregion Global Imports

export default async (): Promise<Connection | undefined> => {
	try {
		return await createConnection({
			name: 'default',
			type: 'mysql',
			host: process.env.DB_HOST,
			port: Number(process.env.DB_PORT),
			username: process.env.DB_USERNAME,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME,
			entities: [__dirname + '/*'],
		});
	} catch (error) {
		return undefined;
	}
};
