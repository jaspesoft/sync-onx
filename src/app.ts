import * as express from 'express';
import * as cron from 'node-cron';
import { connect } from 'mongoose';
import { environment } from './config/config';
import { ONX } from './apps/onx';

const port = 5050;
const app = express();

connect('mongodb://'+ environment.database.user +':'+ environment.database.pass +'@'+ environment.database.srv +':'+ environment.database.port +'/' + environment.database.db , {useNewUrlParser: true}).then(() => {
    app.listen( port, () => {
        console.log( `server BLOCKCHAIN ONX started at http://localhost:${ port }` );
    });

    cron.schedule('*/2  *  *  *  *', () => {
        console.log('Sincronizando red onixcoin');
        ONX();
    });
    
});