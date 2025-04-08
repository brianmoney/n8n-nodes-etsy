// filepath: credentials/EtsyApi.credentials.ts
import {
    ICredentialType,
    INodeProperties,
} from 'n8n-workflow';

export class EtsyApi implements ICredentialType {
    name = 'etsyApi';
    displayName = 'Etsy API';
    documentationUrl = 'etsy';
    properties: INodeProperties[] = [
        {
            displayName: 'Personal Access Token',
            name: 'personalAccessToken',
            type: 'string',
            default: '',
            placeholder: 'Enter your Etsy personal access token',
            description: 'Your personal access token from Etsy developers portal',
        },
        {
            displayName: 'Shop ID',
            name: 'shopId',
            type: 'string',
            default: '',
            placeholder: 'Enter your Etsy shop ID',
            description: 'ID of your Etsy shop',
        },
    ];
}
