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
    icon: undefined, // Thay bằng 'file:fusionbrain.png' nếu bạn thêm tệp hình ảnh
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
        required: true,
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
    try {
      const credentials = (await this.getCredentials('fusionBrainApi')) as number;
      if (!credentials.apiKey) {
        throw new Error('API Key is required');
      }

      const operation = this.getNodeParameter('operation', 0) as string;
      const baseUrl = 'https://api.fusionbrain.ai';

      if (operation === 'listModels') {
        const responseData = await this.helpers.request({
          method: 'GET',
          uri: `${baseUrl}/models`,
          headers: { Authorization: `Bearer ${credentials.apiKey}` },
          json: true,
        });

        if (!responseData) {
          throw new Error('No data returned from FusionBrain API');
        }

        return [this.helpers.returnJsonArray(responseData)];
      }

      if (operation === 'listStyles') {
        const responseData = await this.helpers.request({
          method: 'GET',
          uri: `${baseUrl}/styles`,
          headers: { Authorization: `Bearer ${credentials.apiKey}` },
          json: true,
        });

        if (!responseData) {
          throw new Error('No styles returned from FusionBrain API');
        }

        return [this.helpers.returnJsonArray(responseData)];
      }

      if (operation === 'generate') {
        const prompt = this.getNodeParameter('prompt', 0) as string;
        const width = this.getNodeParameter('width', 0) as number;
        const height = this.getNodeParameter('height', 0) as number;
        const style = this.getNodeParameter('style', 0) as string;

        if (!prompt) {
          throw new Error('Prompt is required for image generation');
        }

        const res = await this.helpers.request({
          method: 'POST',
          uri: `${baseUrl}/generate`,
          headers: { Authorization: `Bearer ${credentials.apiKey}` },
          body: {
            type: 'GENERATE',
            prompt,
            width,
            height,
            style,
          },
          json: true,
        });

        if (!res?.images?.[0]?.url) {
          throw new Error('Image generation failed: No image URL returned');
        }

        const imageUrl = res.images[0].url;
        const imageBuffer = await this.helpers.request({ uri: imageUrl, encoding: null });
        const binaryData = this.helpers.prepareBinaryData(imageBuffer, 'generated_image.png');

        return [[{ json: { imageUrl }, binary: { data: binaryData } }]];
      }

      throw new Error(`Unsupported operation: ${operation}`);
    } catch (error) {
      throw new Error(`FusionBrain Error: ${error.message}`);
    }
  }
}