const fs = require('fs');
const cliProgress = require('cli-progress');
const { synthesizeTextEleven } = require('./textToSpeechHelper');

// Check if config directory exists and create it if not
const homedir = require('os').homedir();
const configDir = `${homedir}/.config/gptutils`;
if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
}

const SYSTEM = 'system';
const USER = 'user';
const ASSISTANT = 'assistant';

class ConversationManager {
    constructor(id, systemPrompt) {
        this._id = id;
        this.conversationFile = `${configDir}/${id}.json`;

        // Check if config file exists and create it if not
        if (!fs.existsSync(this.conversationFile)) {
            const conversationFileContent = [];
            if (systemPrompt) {
                conversationFileContent.push({ role: SYSTEM, content: systemPrompt });
            }
            this.conversation = conversationFileContent;
        } else if (systemPrompt) {
            console.log(`System prompt for ${id} already exists. Ignoring new system prompt.`);
        }
    }

    lastMessage () {
        const messages = this.conversation.filter(message => message.role === ASSISTANT);
        return messages[messages.length - 1] && messages[messages.length - 1].content;
    }

    allMessages(role = ASSISTANT) {
        return this.conversation.filter(message => message.role === role).map(message => message.content);
    }

    get conversation () {
        return JSON.parse(fs.readFileSync(this.conversationFile, 'utf8'));
    }

    set conversation (conversation) {
        fs.writeFileSync(this.conversationFile, JSON.stringify(conversation, null, 4));
    }

    addMessage(role, message) {
        const conversation = this.conversation;
        conversation.push({ role, content: message });
        this.conversation = conversation;
    }

    addUserMessage(message) {
        this.addMessage(USER, message);
    }

    addAssistantMessage(message) {
        this.addMessage(ASSISTANT, message);
    }

    async synthesize(voiceId = 'Joanna') {
        const allMessages = this.allMessages();
        const synthesizedMessages = [];

        const progressbar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
        progressbar.start(allMessages.length, 0);
        for (let i = 0; i < allMessages.length; i++) {
            const audioStream = await synthesizeTextEleven(allMessages[i], { voiceId });
            const filePath = `${configDir}/${this._id}_${i}.mp3`;
            const writer = fs.createWriteStream(filePath);
            audioStream.pipe(writer);
            synthesizedMessages.push(filePath);
            progressbar.increment();
        }
        progressbar.stop();
        return synthesizedMessages;
    }
}

module.exports = { ConversationManager, SYSTEM, USER, ASSISTANT };
