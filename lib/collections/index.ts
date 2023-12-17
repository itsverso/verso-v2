import { getFactoryContractInstance } from "../contracts";

export const createCollection = async (params: any, signer: any) => {
	let factory = getFactoryContractInstance(signer);
	let tx = await factory.createCollection(params);
	let receipt = await tx.wait();
	return receipt.logs[0].address;
};

/** PARAMS
 * struct CollectionInitParams {
        string _collectionName;
        string _collectionMetadataURI;
        uint8 _readType;
        uint8 _writeType;
        address _collectionPermissions;
        uint _minimumBalance;
        address _marketAddress;
        uint _supplyLimit; 
        uint _tokenPrice;
        bool _isBonded;
    }
 */
