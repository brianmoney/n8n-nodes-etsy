// filepath: nodes/Etsy/Etsy.node.ts
import {
    INodeType,
    INodeTypeDescription,
    IExecuteFunctions,
    IDataObject,
} from 'n8n-workflow';
import { etsyApiRequest } from './EtsyApiRequest';

export class Etsy implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Etsy',
        name: 'etsy',
        icon: 'file:etsy.svg',
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
        try {
            // Call the imported etsyApiRequest function
            const response = await etsyApiRequest.call(this, 'GET', '/your-endpoint');
            returnData.push(response);
        } catch (error) {
            throw error;
        }
        return [this.helpers.returnJsonArray(returnData)];
    }
}
