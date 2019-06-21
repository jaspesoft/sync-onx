import { Document } from 'mongoose';

// tslint:disable-next-line:class-name
export interface cy_coins extends Document {
    readonly symbol: string;
    readonly name_coin: string;
    readonly block_explorer: string;
    readonly block_explorer_test: string;
    readonly block_version: number;
    readonly endpoint_balance: string;
    readonly endpoint_transaction: string;
    readonly mainnetwork: any;
    readonly time_block: number;
    total_blocks: number;
    sync_blocks: number;
    endpoint_prices: string;
    endpoint_prices_btc: string;
    active: boolean;
}

// tslint:disable-next-line:class-name
export interface cy_blockchain extends Document {
    symbol: string;
    block_hash: string;
    block_version: number;
    block_size: number;
    confirmed: boolean;
    created_at: Date;
    transactions: any;
    total_transactions: number;
    nro_block: number;
}