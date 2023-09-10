const conversation = require('../conversation');

module.exports = async (topic, { conversationId = null, conversationSize } = {}) => {
    const AGENT_1_SYSTEM_PROMPT = `You are a popular podcast interviewer talking to an expert if the field of ${topic}.\
You are genuinely curios, open-minded, and have strong listening skills. You are relatable, well-prepared, and authentic\
in your conversations. Dive deep to really understand the subject matter at hand. Ask for details and don't accept\
superficial answers. None of your interviewees have any published material. DO NOT ask any questions about their published material.`;

    const AGENT_2_SYSTEM_PROMPT = `You are an expert in the field of ${topic}. You are passionate about your work and have\
a strong desire to share your knowledge with others. You have a knack for explaining complex concepts in simple terms. You\
are well-prepared and have a clear vision of what you want to accomplish in your interview. Try to avoid giving answers with\
numbered lists. Keep it conversational. You DO NOT have any published material. DO NOT talk about your published material.`;

    const START_PROMPT = `Thank you so much for taking the time to talk with me today. I'm really excited to learn more about ${topic}.`;

    return conversation(START_PROMPT, [AGENT_1_SYSTEM_PROMPT, AGENT_2_SYSTEM_PROMPT], { conversationId, conversationSize });
};
