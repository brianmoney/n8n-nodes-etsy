// filepath: nodes/Etsy/Etsy.node.ts
import {
    INodeType,
    INodeTypeDescription,
    IExecuteFunctions,
    IDataObject,
    IHttpRequestMethods,
} from 'n8n-workflow';
import { etsyApiRequest } from './EtsyApiRequest';

export class Etsy implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Etsy',
        name: 'etsy',
        icon: 'file:etsy.svg',
        group: ['transform'],
        version: 1,
        description: 'Execute HTTP requests using Etsy credentials',
        defaults: {
            name: 'Etsy',
        },
        inputs: ['main'],
        outputs: ['main'],
        // Add the credentials reference so n8n shows a credentials UI.
        credentials: [
            {
                name: 'etsyApi',
                required: true,
            },
        ],
        // Add node parameters, e.g. a field to define the endpoint.
        properties: [
            {
                displayName: 'Endpoint',
                name: 'endpoint',
                type: 'string',
                default: '/your-endpoint',
                description: 'The endpoint (relative URL) to call',
            },
            {
                displayName: 'HTTP Method',
                name: 'httpMethod',
                type: 'options',
                options: [
                    { name: 'GET', value: 'GET' },
                    { name: 'POST', value: 'POST' },
                    { name: 'PUT', value: 'PUT' },
                    { name: 'DELETE', value: 'DELETE' },
                ],
                default: 'GET',
            },
            // You can add more parameters as needed.
        ],
    };

    async execute(this: IExecuteFunctions) {
        const returnData: IDataObject[] = [];
        const items = this.getInputData();
        const endpoint = this.getNodeParameter('endpoint', 0) as string;
        const method = this.getNodeParameter('httpMethod', 0) as string;

        for (let i = 0; i < items.length; i++) {
            try {
                const response = await etsyApiRequest.call(
                    this,
                    method as IHttpRequestMethods,
                    endpoint,
                );
                returnData.push(response);
            } catch (error) {
                throw error;
            }
        }
        return [this.helpers.returnJsonArray(returnData)];
    }
}
