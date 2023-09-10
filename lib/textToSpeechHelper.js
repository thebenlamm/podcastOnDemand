const { exec } = require('child_process');
const fs = require('fs');
const { Readable } = require('stream');

const homedir = require('os').homedir();
const configDir = `${homedir}/.config/gptutils`;

exports.synthesizeTextEleven = async (text, { voiceId = 'yoZ06aMxZJJ28mfd3POQ' } = {}) => {
    const headers = {
        Accept: 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': process.env.ELEVEN_API_KEY
    };

    const ttsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
    const ttlInput = {
        text,
        voice_settings: {
            stability: 0.75,
            similarity_boost: 0.75
        }
    };

    const response = await fetch(ttsUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(ttlInput)
    });

    if (!response.ok) {
        throw new Error(`ERROR: API call failed with status ${response.status} ${response.statusText}`);
    }

    const blob = await response.blob();
    const buffer = await blob.arrayBuffer();
    const stream = new Readable();
    stream.push(Buffer.from(buffer));
    stream.push(null);

    return stream;
};

// Given a list of audio files, concatenate them into a single file
exports.concatenateAudioFiles = async (audioFiles, conversationId) => {
    const audioListFilePath = `${configDir}/audio_list.txt`;

    fs.writeFileSync(audioListFilePath, audioFiles.map(file => `file '${file}'`).join('\n'));

    try {
        await new Promise((resolve, reject) => {
            exec(
                `ffmpeg -f concat -safe 0 -i ${audioListFilePath} -c copy ${conversationId}.mp3`,
                (error, stdout, stderr) => {
                    fs.unlinkSync(audioListFilePath);
                    if (error) {
                        console.error(`exec error: ${error}`);
                        reject(error);
                    }
                    console.log(`stdout: ${stdout}`);
                    console.log(`stderr: ${stderr}`);
                    resolve();
                }
            );
        });
    } catch (e) {
        console.error(e);
    }
};
