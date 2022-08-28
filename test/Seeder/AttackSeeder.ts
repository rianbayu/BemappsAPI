//#region Global Imports
import { getManager } from 'typeorm';
//#endregion Global Imports


const seed = async (): Promise<void> => {
	const entityManager = getManager();
	//await entityManager.insert(Weapon, { name: 'Death Star', ammo: 1000, damage: 1000 });
};

export default {
	seed,
};
