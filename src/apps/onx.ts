import { BlockchainServices } from "./blockchain.services";
import { CoinsModel } from "./models/coins.schema";

export const ONX = async () => {
    
    const blockchain = await new BlockchainServices('ONX');
    try {
        await blockchain.syncUp(await CoinsModel.findOne({symbol: 'ONX'}).lean(false).exec());
        
    }catch(e) {
        console.error(e);
        console.log('error sincronizando ONX');
    }
};