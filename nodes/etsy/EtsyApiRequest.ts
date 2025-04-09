import { IExecuteFunctions, IHttpRequestMethods, IDataObject, NodeOperationError } from 'n8n-workflow';
import { createHash, randomBytes } from 'crypto';

function generateCodeChallenge(codeVerifier: string): string {
    const hash = createHash('sha256').update(codeVerifier).digest();
    return hash.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

export async function etsyApiRequest(
    this: IExecuteFunctions,
    method: IHttpRequestMethods,
    endpoint: string,
    body: IDataObject = {},
): Promise<any> {
    // Retrieve credentials from n8n. These must include keyString and sharedSecret.
    const credentials = await this.getCredentials('etsyApi');
    if (!credentials) {
        throw new NodeOperationError(this.getNode(), 'No credentials got returned!');
    }
    const key = credentials.keyString as string;
    const secret = credentials.sharedSecret as string;
    if (!key || !secret) {
        throw new NodeOperationError(this.getNode(), 'Keystring or Shared Secret not provided!');
    }

	// If no access token exists, we need to start the PKCE flow.
    if (!credentials.accessToken) {
        // If no authorization code has been provided,
        // instruct the user to authorize the app.
        if (!credentials.authorizationCode) {
            // Generate a code verifier and its code challenge.
            const codeVerifier = randomBytes(32).toString('hex');
            const codeChallenge = generateCodeChallenge(codeVerifier);
            const state = randomBytes(16).toString('hex');
            // Cast redirectUri and scope as strings.
            const redirectUri = (credentials.redirectUri || 'https://www.example.com/callback') as string;
            const scope = (credentials.scope || 'transactions_r transactions_w') as string;
            const authUrl = `https://www.etsy.com/oauth/connect?response_type=code` +
                `&redirect_uri=${encodeURIComponent(redirectUri)}` +
                `&scope=${encodeURIComponent(scope)}` +
                `&client_id=${encodeURIComponent(key)}` +
                `&state=${encodeURIComponent(state)}` +
                `&code_challenge=${encodeURIComponent(codeChallenge)}` +
                `&code_challenge_method=S256`;
            throw new NodeOperationError(
                this.getNode(),
                `Please authorize the application by visiting this URL and enter the returned authorization code (and codeVerifier) in your credentials:\n${authUrl}`,
            );
        }
        // If an authorization code is available, then exchange it for an access token.
        const codeVerifier = credentials.codeVerifier as string;
        if (!codeVerifier) {
            throw new NodeOperationError(this.getNode(), 'No codeVerifier found in credentials!');
        }
        const redirectUri = (credentials.redirectUri || 'https://www.example.com/callback') as string;
        const tokenOptions = {
            method: 'POST' as IHttpRequestMethods,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `grant_type=authorization_code` +
                `&client_id=${encodeURIComponent(key)}` +
                `&code=${encodeURIComponent(credentials.authorizationCode as string)}` +
                `&redirect_uri=${encodeURIComponent(redirectUri)}` +
                `&code_verifier=${encodeURIComponent(codeVerifier)}`,
        };

        const tokenResponse = await this.helpers.request('https://openapi.etsy.com/v3/public/oauth/token', tokenOptions);
        const tokenData = JSON.parse(tokenResponse);
        const accessToken = tokenData.access_token;
        if (!accessToken) {
            throw new NodeOperationError(this.getNode(), 'Failed to obtain access token from Etsy!');
        }
        credentials.accessToken = accessToken;
    }

    // Now use the obtained access token to make the intended API request.
    const requestHeaders = {
        Authorization: `Bearer ${credentials.accessToken}`,
        'Content-Type': 'application/json',
    };

    const options = {
        method,
        headers: requestHeaders,
        body: Object.keys(body).length ? JSON.stringify(body) : undefined,
    };

    const baseUrl = 'https://openapi.etsy.com/v3/application';
    const response = await this.helpers.request(`${baseUrl}${endpoint}`, options);
    return JSON.parse(response);
}
