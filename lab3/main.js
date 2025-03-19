const sounds = {
    a: document.getElementById('a'),
    s: document.getElementById('s'),
    d: document.getElementById('d'),
    f: document.getElementById('f')
};

let recording = false;
let recordingData = { a: [], s: [], d: [], f: [] };
let lastTime = Date.now();

document.addEventListener('keypress', (e) => {
    const sound = sounds[e.key];
    if (sound) {
        sound.currentTime = 0;
        sound.play();

        if (recording) {
            const timeOffset = Date.now() - lastTime;
            recordingData[e.key].push(timeOffset);
            lastTime = Date.now();
        }
    }
});

document.getElementById('start').addEventListener('click', () => {
    recording = true;
    recordingData = { a: [], s: [], d: [], f: [] };
    lastTime = Date.now();
});

document.getElementById('stop').addEventListener('click', () => {
    recording = false;
});

function playChannel(channel) {
    const channelData = recordingData[channel];
    let lastPlayTime = 0;

    channelData.forEach((timeOffset) => {
        setTimeout(() => {
            sounds[channel].currentTime = 0;
            sounds[channel].play();
        }, lastPlayTime + timeOffset);
        lastPlayTime += timeOffset;
    });
}

document.getElementById('play-a').addEventListener('click', () => {
    playChannel('a');
});
document.getElementById('play-s').addEventListener('click', () => {
    playChannel('s');
});
document.getElementById('play-d').addEventListener('click', () => {
    playChannel('d');
});
document.getElementById('play-f').addEventListener('click', () => {
    playChannel('f');
});

document.getElementById('play-all').addEventListener('click', () => {
    playChannel("a");
    playChannel("s");
    playChannel("d");
    playChannel("f");
});
