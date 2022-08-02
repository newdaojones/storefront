import { ProposalTypes } from "@walletconnect/types";
import {
    DEFAULT_COSMOS_EVENTS,
    DEFAULT_COSMOS_METHODS,
    DEFAULT_EIP155_METHODS,
    DEFAULT_EIP_155_EVENTS,
    DEFAULT_SOLANA_EVENTS,
    DEFAULT_SOLANA_METHODS,
} from "../consts";

export const getNamespacesFromChains = (chains: string[]) => {
    const supportedNamespaces: string[] = [];
    chains.forEach(chainId => {
        const [namespace] = chainId.split(":");
        if (!supportedNamespaces.includes(namespace)) {
            supportedNamespaces.push(namespace);
        }
    });

    return supportedNamespaces;
};

export const getSupportedMethodsByNamespace = (namespace: string) => {
    switch (namespace) {
        case "eip155":{
            let values = Object.values(DEFAULT_EIP155_METHODS);
            console.log(`selected methods ${values} for namespace: ${namespace}` );
            return values;
        }
        case "cosmos":
            return Object.values(DEFAULT_COSMOS_METHODS);
        case "solana":
            return Object.values(DEFAULT_SOLANA_METHODS);
        default:
            throw new Error(`No default methods for namespace: ${namespace}`);
    }
};

export const getSupportedEventsByNamespace = (namespace: string) => {
    switch (namespace) {
        case "eip155":
            return Object.values(DEFAULT_EIP_155_EVENTS);
        case "cosmos":
            return Object.values(DEFAULT_COSMOS_EVENTS);
        case "solana":
            return Object.values(DEFAULT_SOLANA_EVENTS);
        default:
            throw new Error(`No default events for namespace: ${namespace}`);
    }
};

export const getRequiredNamespaces = (chains: string[]): ProposalTypes.RequiredNamespaces => {
    const selectedNamespaces = getNamespacesFromChains(chains);
    console.log("selected namespaces:", selectedNamespaces);

    // for (let item in selectedNamespaces){
    //     console.log(`"supported methods for: ${item} ${getSupportedMethodsByNamespace(item)}`);
    // }

    return Object.fromEntries(
        selectedNamespaces.map(namespace => [
            namespace,
            {
                methods: getSupportedMethodsByNamespace(namespace),
                chains: chains.filter(chain => chain.startsWith(namespace)),
                events: getSupportedEventsByNamespace(namespace) as any[],
            },
        ]),
    );
};
