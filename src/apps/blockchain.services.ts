import { CoinsModel, BlockchainModel, BlockchainTransactionModel } from "./models/coins.schema";
import * as core from 'bitcoin-rpc-promise';
const { forEach } = require('p-iteration');
import { cy_coins } from "./models/coins.interface";

export class BlockchainServices {
    private coin: string;
    private nodo: any;
    private numNodo = 0;

    constructor(nodoCoin: string, numberNodo = 0) {
        this.coin = nodoCoin;
        this.numNodo = 0;
    }
    public async getConnection() {
        let data = await CoinsModel.findOne({symbol: this.coin}).lean(false).exec();
        
        data = data.mainnetwork[this.numNodo];
        if (data === null) {
            data = data.mainnetwork;
        }
        return new core(data.protocol + '://' + data.user_rpc + ':' + data.pass_rpc + '@' + data.host_rpc + ':' + data.port_rpc);
        
    }
    private async getCounBlock() {
        return await this.nodo.getBlockCount();
    }
    public async syncUp(coin: cy_coins) {
        this.nodo = await this.getConnection();

        const countBlock = await this.getCounBlock();
        this.updateTotalBlocks(coin._id , countBlock);
        console.log('Total de bloques: ' + countBlock);
        console.log('total bloques sincronizados ' + coin.sync_blocks);
        if (countBlock >= coin.sync_blocks) {
            await this.saveBlock(coin, countBlock, coin.sync_blocks);
        }

        
    }
    private async updateTotalBlocks(coinID: string, totalBlock: number) {
        await CoinsModel.findOneAndUpdate(
            {_id: coinID },
            {total_blocks: totalBlock},
        );
    }
    public async makeSaveBlock(crypto: string, block: any, txArray: any[], checkExist = true): Promise<boolean> {
        let confirmation = false;
        if (block.confirmations > 0) {
            confirmation = true;
        }
        
        const existe = await BlockchainModel.findOne({symbol: crypto,  nro_block: block.height}).lean(false).exec();
        console.log(existe);
        if (existe !== null) {
            return false;
        }
        

        const newBlock = new BlockchainModel({
            symbol: crypto,
            block_hash: block.hash,
            block_version: block.version,
            block_size: block.size,
            confirmed: confirmation,
            created_at: new Date(block.time * 1000),
            total_transactions: block.tx.length,
            nro_block: block.height,
        });
        await newBlock.save();
        
        return true;
        
    }
    private async saveBlock(coin: cy_coins, totalBlock: number, nroBlock: number): Promise<any> {
        const hash = await this.nodo.getblockhash(nroBlock);
        const block = await this.nodo.getblock(hash);
        const txArray = await this.saveTxBlock(hash, block.tx, nroBlock, coin.symbol);

        await this.makeSaveBlock(coin.symbol, block, txArray);

        // actualizo el control de bloques sincronizados
        await this.updateControlBlock(coin._id, nroBlock + 1);
        console.log('bloque nro: ' + block.height);
        if (nroBlock + 1 <= totalBlock) {
            await this.saveBlock(coin, totalBlock, nroBlock + 1);
        } else {
            // ya sincronizo la totalidad de bloques, entonces vamos a buscar en el nodo nuevos bloques.
            this.syncUp(await CoinsModel.findOne({symbol: coin.symbol}).lean(false).exec());

        }
        
    }
    private async updateControlBlock(id: string, nextBlock: number): Promise<any> {
        return await CoinsModel.findOneAndUpdate(
            {_id: id },
            {sync_blocks: nextBlock},
        );
    }
    public async createArrayTx(txid: string, txinfo: any): Promise<any[]> {
        let x = [];
        await forEach(txinfo.vout, async vout => {
            if (vout.scriptPubKey.type === 'pubkey' || vout.scriptPubKey.type === 'pubkeyhash') {
                x.push({
                    tx: txid,
                    amount: vout.value,
                    addresses: vout.scriptPubKey.addresses[0],
                    indx: vout.n,
                });

            } else {
                x.push({
                    tx: txid,
                    amount: vout.value,
                    addresses: 'NONE',
                    indx: vout.n,
                });
            }
        });

        return x;
    }
    private async saveTxBlock(hashblock: string, txs: any[], nroBlock: number, coin: string): Promise<any> {
        
        const txArray = [];
        await forEach(txs, async txid => {
            const tx = await this.nodo.getrawtransaction(txid);
            const txinfo = await this.nodo.decoderawtransaction(tx);
            
            const txData = await this.createArrayTx(txid, txinfo);

            txArray.push(txData);
            const blockTx = new BlockchainTransactionModel({
                symbol: coin,
                nro_block: nroBlock,
                block_hash: hashblock,
                transactions: txData
            });
            blockTx.save();
        });
        return txArray;
    }
}