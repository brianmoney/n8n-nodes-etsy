// filepath: nodes/Etsy/Etsy.node.ts
import {
    INodeType,
    INodeTypeDescription,
    IExecuteFunctions,
    IHttpRequestMethods,
    NodeOperationError,
    IDataObject,
} from 'n8n-workflow';
import { etsyApiRequest } from './EtsyApiRequest';

export async function etsyApiRequest(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
): Promise<any> {
	// Await the credentials retrieval.
	const credentials = await this.getCredentials('etsyApi');
	if (!credentials) {
		throw new NodeOperationError(this.getNode(), 'No credentials got returned!');
	}
	const personalAccessToken = credentials.personalAccessToken as string;

	const headers = {
		Authorization: `Bearer ${personalAccessToken}`,
		'Content-Type': 'application/json',
	};

	const options = {
		method,
		headers,
		body: Object.keys(body).length ? JSON.stringify(body) : undefined,
	};

	const baseUrl = 'https://openapi.etsy.com/v3/application';

	const response = await this.helpers.request(`${baseUrl}${endpoint}`, options);
	return JSON.parse(response);
}

export class Etsy implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Etsy',
        name: 'etsy',
        icon: 'file:etsy.svg', // optional icon path
        group: ['transform'],
        version: 1,
        description: 'Consume Etsy API',
        defaults: {
            name: 'Etsy',
        },
        inputs: ['main'],
        outputs: ['main'],
        properties: [
            // Define your node properties here
        ],
    };

    async execute(this: IExecuteFunctions) {
        const returnData: IDataObject[] = [];
        // Use the etsyApiRequest helper function as needed.
        try {
            const response = await etsyApiRequest.call(this, 'GET', '/your-endpoint');
            returnData.push(response);
        } catch (error) {
            throw error;
        }

        return [this.helpers.returnJsonArray(returnData)];
    }
}
