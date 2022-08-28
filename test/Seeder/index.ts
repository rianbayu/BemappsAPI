//#region Local Imports

import AttackSeeder from './AttackSeeder';
//#region Local Imports

const seed = async (): Promise<void> => {
	
	await AttackSeeder.seed();
};

export default {
	seed,
};
