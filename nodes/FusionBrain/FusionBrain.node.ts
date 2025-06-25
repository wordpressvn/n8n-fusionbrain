import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

import { IDataObject } from 'n8n-workflow';

export class FusionBrain implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'FusionBrain',
    name: 'fusionBrain',
    icon: 'file:fusionbrain.png',
    group: ['transform'],
    version: 1,
    description: 'Interact with FusionBrain AI',
    defaults: {
      name: 'FusionBrain',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'fusionBrainApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        options: [
          { name: 'Generate Image', value: 'generate' },
          { name: 'List Models', value: 'listModels' },
          { name: 'List Styles', value: 'listStyles' },
        ],
        default: 'generate',
      },
      {
        displayName: 'Prompt',
        name: 'prompt',
        type: 'string',
        default: '',
        displayOptions: { show: { operation: ['generate'] } },
      },
      {
        displayName: 'Width',
        name: 'width',
        type: 'number',
        default: 1024,
        displayOptions: { show: { operation: ['generate'] } },
      },
      {
        displayName: 'Height',
        name: 'height',
        type: 'number',
        default: 1024,
        displayOptions: { show: { operation: ['generate'] } },
      },
      {
        displayName: 'Style',
        name: 'style',
        type: 'string',
        default: '',
        displayOptions: { show: { operation: ['generate'] } },
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const creds = await this.getCredentials('fusionBrainApi') as IDataObject;
    const operation = this.getNodeParameter('operation', 0) as string;
    const baseUrl = 'https://api.fusionbrain.ai';

    let responseData;

    if (operation === 'listModels') {
      responseData = await this.helpers.request({
        method: 'GET',
        uri: `${baseUrl}/models`,
        headers: { Authorization: creds.apiKey as string },
        json: true,
      });
      return [this.helpers.returnJsonArray(responseData)];
    }

    if (operation === 'listStyles') {
      responseData = await this.helpers.request({
        method: 'GET',
        uri: `${baseUrl}/styles`,
        headers: { Authorization: creds.apiKey as string },
        json: true,
      });
      return [this.helpers.returnJsonArray(responseData)];
    }

    if (operation === 'generate') {
      const prompt = this.getNodeParameter('prompt', 0) as string;
      const width = this.getNodeParameter('width', 0) as number;
      const height = this.getNodeParameter('height', 0) as number;
      const style = this.getNodeParameter('style', 0) as string;

      const res = await this.helpers.request({
        method: 'POST',
        uri: `${baseUrl}/generate`,
        headers: { Authorization: creds.apiKey as string },
        body: {
          type: 'GENERATE',
          prompt,
          width,
          height,
          style,
        },
        json: true,
      });

      const imageUrl = res?.images?.[0]?.url;
      if (!imageUrl) throw new Error('Image generation failed');

      const imageBuffer = await this.helpers.request({ uri: imageUrl, encoding: null });
      const binaryData = this.helpers.prepareBinaryData(imageBuffer);

      return [[{ json: {}, binary: { data: binaryData } }]];
    }

    throw new Error(`Unsupported operation: ${operation}`);
  }
}