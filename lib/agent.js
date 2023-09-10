const uuid = require('uuid');
const fs = require('fs');
const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

const { ConversationManager } = require('./conversationManager');

// const DEFAULT_MODEL = 'gpt-4';
const DEFAULT_MODEL = 'gpt-3.5-turbo';

class Agent {
    constructor(name, { systemPrompt } = {}) {
        this._name = name || uuid.v4();
        this._conversationManager = new ConversationManager(this._name, systemPrompt);
    }

    get name() {
        return this._name;
    }

    addAssistantMessage(message) {
        this._conversationManager.addAssistantMessage(message);
    }

    async chat(prompt, { model = DEFAULT_MODEL, temperature = 0.8, topP = 1 } = {}) {
        const conversation = this._conversationManager.conversation;
        conversation.push({ role: 'user', content: prompt });

        this._conversationManager.addUserMessage(prompt);

        // Call OpenAI API
        const gptResponse = await this.createChat(model, temperature, topP, conversation);
        const responseContent = gptResponse.data.choices[0].message.content;

        const totalTokens = gptResponse.data.usage.total_tokens;
        const finishReason = gptResponse.data.choices[0].finish_reason;

        if (totalTokens > 2000) {
            console.warn(`WARNING: API call used ${totalTokens} tokens.`);
        }

        if (finishReason !== 'stop') {
            console.warn(`WARNING: API call did not finish due to ${finishReason}.`);
        }

        this._conversationManager.addAssistantMessage(responseContent);
    }

    async createChat(model, temperature, topP, conversation) {
        const gptResponse = await openai.createChatCompletion({
            model, temperature, top_p: topP, messages: conversation
        });
        // fs.writeFileSync(`gpt-response-${this._name}-${Date.now()}.json`, gptResponse.data.choices[0].message.content, null, 2);
        return gptResponse;
    }

    last() {
        return this._conversationManager.lastMessage();
    }

    all() {
        return this._conversationManager.allMessages();
    }

    synthesize(voiceId = 'Joanna') {
        return this._conversationManager.synthesize(voiceId);
    }
}

module.exports = { Agent, DEFAULT_MODEL };
