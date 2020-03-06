import { ethers } from "ethers";

type NetworkName = "local" | "pilot" | "poa" | "test" | "tobalaba" | "volta";

interface Signature {
    hash: Uint8Array;
    r: string;
    s: string;
    recoveryParam?: number;
    v?: number;
}

interface ContractDefinition {
    abi: {
        constants: boolean;
        input: {
            name: string;
            type: string;
        }[];
        name: string;
        outputs: {
            name: string;
            type: string;
        }[];
        payable: boolean;
        stateMutability: string;
        type: string;
        signature: string;
    };
    address: string;
    bytecode: string;
}

interface EthersTransactionReceipt {
    to?: string;
    from?: string;
    contractAddress?: string;
    transactionIndex?: number;
    root?: string;
    gasUsed?: any;
    logsBloom?: string;
    blockHash?: string;
    transactionHash?: string;
    logs?: Array<any>;
    blockNumber?: number;
    confirmations?: number;
    cumulativeGasUsed?: any;
    byzantium: boolean;
    status?: number;
}

export default class SnC {
    provider: ethers.providers.BaseProvider;
    wallet: ethers.Wallet;
    settlementJson: ContractDefinition;
    eurTokenJson: ContractDefinition;
    usdTokenJson: ContractDefinition;
    chfTokenJson: ContractDefinition;
    settlement: ethers.Contract;
    eurToken: ethers.Contract;
    usdToken: ethers.Contract;
    chfToken: ethers.Contract;
    constructor(network: NetworkName, privateKey?: string, provider?: ethers.providers.BaseProvider);
    provisionPaymentTokens(token: ethers.Contract, amount: number, recipient: string): Promise<EthersTransactionReceipt>;
    getSignedTransfer(cdrId: string, recipient: string, amount: number | string, currency: string): Signature;
    transfer(cdrId: string, recipient: string, amount: number, currency: string, signature: Signature): Promise<string>;
}
