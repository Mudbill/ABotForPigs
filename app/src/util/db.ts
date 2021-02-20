import { Datastore } from 'nedb-async-await';
import { databaseFile } from '../../config'
import { console } from '../util/log';

console.info(`Creating database instance...`);
const db = Datastore({
	autoload: true,
	filename: databaseFile
});

export default db;