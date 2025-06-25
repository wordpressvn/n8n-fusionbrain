@wordpressvn/n8n-fusionbrain
An n8n node to integrate with the FusionBrain AI API for generating images and retrieving models/styles.
Installation

Install the node in your n8n instance:npm install @wordpressvn/n8n-fusionbrain


Restart your n8n instance to load the node.

Setup

Obtain API Credentials:

Sign up at FusionBrain AI to get your API Key and Secret Key.
In n8n, go to Credentials, select FusionBrain API, and enter your API Key and Secret Key.


Add the FusionBrain Node:

In your n8n workflow, add the FusionBrain node.
Select an operation: Generate Image, List Models, or List Styles.
Configure the node parameters (e.g., Prompt, Width, Height, Style for image generation).



Operations

Generate Image: Create an image based on a text prompt, with customizable width, height, and style.
List Models: Retrieve available AI models from FusionBrain API.
List Styles: Retrieve available styles for image generation.

Example Workflow

Add a FusionBrain node and set the operation to Generate Image.
Enter a prompt (e.g., "A futuristic city at sunset"), set width/height (e.g., 1024x1024), and choose a style.
Connect the node to other nodes in your workflow to process the generated image.

Development
To contribute or modify the node:

Clone the repository:git clone https://github.com/wordpressvn/n8n-fusionbrain.git


Install dependencies:npm install


Build the project:npm run build


Link to n8n for testing:npm link
cd /path/to/n8n
npm link @wordpressvn/n8n-fusionbrain



License
MIT License. See LICENSE for details.
Support
For issues or feature requests, open an issue on GitHub.