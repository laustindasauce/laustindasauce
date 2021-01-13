require("isomorphic-unfetch");
const { promises: fs } = require("fs");
const path = require("path");

const API_KEY = process.env.API_KEY
const USER = process.env.USER

const API_ROOT = "http://ws.audioscrobbler.com/2.0/"

const SONG_URL = `${API_ROOT}?method=user.getrecenttracks&user=${USER}&limit=1&api_key=${API_KEY}&format=json`

async function main() {
    const readmeTemplate = (
        await fs.readFile(path.join(process.cwd(), "./README.template.md"))
    ).toString("utf-8");
    
    const data = async (url) => {
        const r = await fetch(url);
        return await r.json();
    }

    dataJSON = await data(SONG_URL)
    songInfo = dataJSON.recenttracks.track[0]
    const artist = songInfo.artist['#text']
    const song = songInfo.name
    const img = songInfo.image[2]['#text']

    const readme = readmeTemplate
        .replace("{song}", song)
        .replace("{artist}", artist)
        .replace("{img}", img);

    await fs.writeFile("README.md", readme);
}

main();