import {Transaction, Wallet} from '@zilliqa/zilliqa-js-account';
import {
  Provider,
  ZilliqaModule,
  sign,
  RPCResponse,
} from '@zilliqa/zilliqa-js-core';

export default class Blockchain implements ZilliqaModule {
  signer: Wallet;
  provider: Provider;

  constructor(provider: Provider, signer: Wallet) {
    this.provider = provider;
    this.signer = signer;
  }

  getDSBlock(blockNum: number): Promise<any> {
    return this.provider.send(BlockchainMethods.GetDSBlock, {});
  }

  getLatestDSBlock(): Promise<any> {
    return this.provider.send(BlockchainMethods.GetLatestTxBlock, {});
  }

  getTxBlock(blockNum: number): Promise<any> {
    return this.provider.send(BlockchainMethods.GetTxBlock, {});
  }

  getLatestTxBlock(): Promise<any> {
    return this.provider.send(BlockchainMethods.GetLatestTxBlock, {});
  }

  /**
   * createTransaction
   *
   * Creates a transaction and polls the lookup node for a transaction
   * receipt. If, within the timeout, no transaction is found, the transaction
   * is considered as lost.
   *
   * @param {Transaction} payload
   * @returns {Promise<RPCResponse>}
   */
  @sign
  async createTransaction(tx: Transaction): Promise<Transaction> {
    try {
      const {id, ...json} = tx.txParams;

      const response = await this.provider.send(
        BlockchainMethods.CreateTransaction,
        [{...json, amount: json.amount.toNumber()}],
      );

      return tx.confirm(response.result.TranID);
    } catch (err) {
      throw err;
    }
  }

  /**
   * getTransaction
   *
   * @param {string} txHash
   * @returns {Promise<any>}
   */
  getTransaction(txHash: string): Promise<any> {
    return this.provider.send(BlockchainMethods.GetTransaction);
  }
}
