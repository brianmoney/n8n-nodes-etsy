// filepath: nodes/Etsy/Etsy.node.ts
import { IExecuteFunctions } from 'n8n-core';
import { IDataObject } from 'n8n-workflow';

async function etsyApiRequest(this: IExecuteFunctions, method: string, endpoint: string, body: IDataObject = {}): Promise<any> {
    const credentials = this.getCredentials('etsyApi');
    if (!credentials) {
        throw new Error('No credentials got returned!');
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
