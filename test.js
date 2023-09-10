const { comediansTalking, podcast, academicInterview } = require('.');

const runner = async () => {
    // await podcast('Albert Einstein', { conversationId: 'test-128', conversationSize: 1 });
    // await comediansTalking({ conversationSize: 5 });
    await academicInterview('Quantum Mechanics', { conversationSize: 10 });
};

runner();
