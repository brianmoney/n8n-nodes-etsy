// filepath: credentials/EtsyApi.credentials.ts
import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class EtsyApi implements ICredentialType {
	name = 'etsyApi';
	displayName = 'Etsy API';
	documentationUrl = 'https://developers.etsy.com/documentation';
	properties: INodeProperties[] = [
		{
			displayName: 'Keystring',
			name: 'keyString',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			placeholder: 'Enter your Etsy App Keystring',
			description: 'Your App Keystring from Etsy developers portal',
	},
	{
			displayName: 'Shared Secret',
			name: 'sharedSecret',
			type: 'string',
			default: '',
			placeholder: 'Enter your Etsy App Shared Secret',
			description: 'Enter your App Shared Secret from the developers portal',
	},
	];
}
