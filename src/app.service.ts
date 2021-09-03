import { PrivateKeyWalletSubprovider, RPCSubprovider } from '@0x/subproviders';
import { Injectable } from '@nestjs/common';
import Web3ProviderEngine from 'web3-provider-engine';
import { OpenSeaPort, Network } from 'opensea-js';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async fulfillOrder(token_id: number): Promise<string> {
    const PRIVATE_KEY = process.env.PRIVATE_KEY;
    const ALCHEMY_KEY = process.env.ALCHEMY_KEY;
    const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
    const ACCOUNT_ADDRESS = process.env.ACCOUNT_ADDRESS;

    const privateKeyWalletSubprovider = new PrivateKeyWalletSubprovider(
      PRIVATE_KEY,
      4,
    );
    const alchemyRpcSubprovider = new RPCSubprovider(
      `https://eth-${process.env.NETWORK}.alchemyapi.io/v2/${ALCHEMY_KEY}`,
    );

    const providerEngine = new Web3ProviderEngine();

    providerEngine.addProvider(privateKeyWalletSubprovider);
    providerEngine.addProvider(alchemyRpcSubprovider);
    providerEngine.start();

    const seaport = new OpenSeaPort(providerEngine, {
      networkName: Network.Rinkeby,
    });

    const order = await seaport.api.getOrder({
      asset_contract_address: CONTRACT_ADDRESS,
      token_id,
    });

    const transactionHash = await seaport.fulfillOrder({
      order,
      accountAddress: ACCOUNT_ADDRESS,
    });

    return transactionHash;
  }
}
