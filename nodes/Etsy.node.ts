// filepath: nodes/Etsy/Etsy.node.ts
import { NodeOperationError, IExecuteFunctions, IHttpRequestMethods } from 'n8n-workflow';
import { IDataObject } from 'n8n-workflow';

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
