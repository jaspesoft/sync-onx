import * as cron from 'node-cron';
import { connect } from 'mongoose';
import { environment } from './config/config';
import { ONX } from './apps/onx';

connect('mongodb://'+ environment.database.user +':'+ environment.database.pass +'@'+ environment.database.srv +':'+ environment.database.port +'/' + environment.database.db , {useNewUrlParser: true}).then(() => {
    cron.schedule('*/2  *  *  *  *', () => {
        console.log('Sincronizando red onixcoin');
        ONX();
    });
    
});