import { getFactoryContractInstance } from "../contracts";

export const createCollection = async (params: any, signer: any) => {
	console.log("here", params);
	let factory = getFactoryContractInstance(signer);
	console.log("Factory: ", factory);
	let tx = await factory.createCollection(params);
	console.log("hereee");
	let receipt = await tx.wait();
	return receipt.logs[0].address;
};

export const createCollectionV2 = async (params: any) => {
	let route = process.env.NEXT_PUBLIC_BASE_URL + "/create-collection";
	let response = await fetch(route, {
		method: "POST",
		body: JSON.stringify(params),
	});
	return await response.json();
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
