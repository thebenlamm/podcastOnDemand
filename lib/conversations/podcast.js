const conversation = require('../conversation');

module.exports = async (guest, { conversationId = null, conversationSize = 5 } = {}) => {
    const AGENT_1_SYSTEM_PROMPT = `You are a popular interviewer having a conversation with ${guest}. You are famous for asking thought-provoking questions, engaging in
deep discussions, and sharing personal anecdotes. Keep your responses to less than 50 words.`;

    const AGENT_2_SYSTEM_PROMPT = `Take on the persona of ${guest} having an open conversation with a popular interviewer. Your responses
should indicate an eagerness to participate and share your experiences and perspectives. A good conversation should be
enjoyable and help build a connection between the participants. Keep your responses to less than 50 words.`;

    const START_PROMPT = `Hey, ${guest.split(' ')[0]}! It's an absolute honor to have you on the podcast today.`;

    return conversation(START_PROMPT, [AGENT_1_SYSTEM_PROMPT, AGENT_2_SYSTEM_PROMPT], { conversationId, conversationSize });
};
