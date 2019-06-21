import * as mongoose from 'mongoose';
import Joigoose = require('joigoose');
import * as Joi from 'joi';
import { cy_coins, cy_blockchain } from './coins.interface';

const options: Joi.ValidationOptions = {abortEarly: true};
const joigoose = Joigoose(mongoose, options);

/* coins */

const joiCoinSchema = Joi.object({
    symbol: Joi.string().max(5).min(3).required(),
    name_coin: Joi.string().max(60).required(),
    block_version: Joi.number(),
    block_explorer: Joi.string().required(),
    block_explorer_test: Joi.string().required(),
    endpoint_balance: Joi.string().required(),
    endpoint_transaction: Joi.string().required(),
    active: Joi.boolean().default(true),
    mainnetwork: Joi.array(),
    total_blocks: Joi.number().default(0),
    sync_blocks:  Joi.number().default(0),
    time_block: Joi.number().required(),
    endpoint_prices: Joi.string().required(),
    endpoint_prices_btc: Joi.string().required(),
});
const CoinShema = new mongoose.Schema(joigoose.convert(joiCoinSchema));
let Coins: any;
try {
    Coins = mongoose.model<cy_coins>('cy_coins', CoinShema);
} catch (error) { 
    Coins = mongoose.model<cy_coins>('cy_coins');
}
export const CoinsModel = Coins;


/* blockchain */

const joiBlockchainSchema = Joi.object({
    symbol: Joi.string().max(5).min(3).required(),
    nro_block: Joi.number(),
    block_version: Joi.number(),
    block_hash: Joi.string(),
    block_size: Joi.number(),
    confirmed: Joi.boolean(),
    created_at: Joi.date(),
    total_transactions: Joi.number(),
    transactions: Joi.any(),
});
const BlockchainShema = new mongoose.Schema(joigoose.convert(joiBlockchainSchema));
let Blockchain: any;
try {
    Blockchain = mongoose.model<cy_blockchain>('cy_blockchain', BlockchainShema);
}catch(error) {
    Blockchain = mongoose.model<cy_blockchain>('cy_blockchain');
}
export const BlockchainModel = Blockchain;

/* blockchain transaction */
const joiBlockchainTransactionSchema = Joi.object({
    symbol: Joi.string().max(5).min(3).required(),
    nro_block: Joi.number().required(),
    block_hash:Joi.string().required(),
    transactions: Joi.any().required(),
});
const BlockchainTransactionShema = new mongoose.Schema(joigoose.convert(joiBlockchainTransactionSchema));
let BlockchainTx: any;
try {
    BlockchainTx = mongoose.model<cy_blockchain>('cy_blockchain_transactions', BlockchainTransactionShema);
}catch(error) {
    BlockchainTx = mongoose.model<cy_blockchain>('cy_blockchain_transactions');
}
export const BlockchainTransactionModel = BlockchainTx;