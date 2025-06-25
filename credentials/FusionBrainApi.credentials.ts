import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class FusionBrainApi implements ICredentialType {
  name = 'fusionBrainApi';
  displayName = 'FusionBrain API';
  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      default: '',
    },
    {
      displayName: 'Secret Key',
      name: 'secretKey',
      type: 'string',
      default: '',
    },
  ];
}