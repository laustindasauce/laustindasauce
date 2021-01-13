require("isomorphic-unfetch");
const { promises: fs } = require("fs");
const path = require("path");

const API_KEY = process.env.API_KEY
const USER = process.env.USER

const API_ROOT = "http://ws.audioscrobbler.com/2.0/"

const RECENT_URL = `${API_ROOT}?method=user.getrecenttracks&user=${USER}&limit=1&api_key=${API_KEY}&format=json`

const SONG_URL = `${API_ROOT}?method=user.gettoptracks&user=${USER}&limit=1&api_key=${API_KEY}&format=json`

const ARTIST_URL = `${API_ROOT}?method=user.gettopartists&user=${USER}&limit=1&api_key=${API_KEY}&format=json`

const USER_URL = `${API_ROOT}?method=user.getinfo&user=${USER}&api_key=${API_KEY}&format=json`

async function main() {
    const readmeTemplate = (
        await fs.readFile(path.join(process.cwd(), "./README.template.md"))
    ).toString("utf-8");
    
    const get = async (url) => {
        const r = await fetch(url);
        return await r.json();
    }

    const getTopTrack = async (artist) => {
        const url = `${API_ROOT}?method=artist.gettoptracks&artist=${artist}&limit=1&api_key=${API_KEY}&format=json`
        const r = await fetch(url);
        trackJSON = await r.json();
        return trackJSON.toptracks.track[0].image[2]['#text']
    }

    recentJSON = await get(RECENT_URL)
    songInfo = recentJSON.recenttracks.track[0]
    const artist = songInfo.artist['#text']
    const song = songInfo.name
    const img = songInfo.image[2]['#text']

    artistJSON = await get(ARTIST_URL)
    topArtist = artistJSON.topartists.artist[0]
    const topArtistName = topArtist.name
    const topArtistStreams = topArtist.playcount
    const topArtistImg = await getTopTrack(topArtistName)

    songJSON = await get(SONG_URL)
    songJSON = songJSON.toptracks.track[0]
    const topSongArtist = songJSON.artist.name
    const topSongName = songJSON.name
    const topSongImg = songJSON.image[2]['#text']

    userJSON = await get(USER_URL)
    const playcount = userJSON.user.playcount

    const readme = readmeTemplate
        .replace("{song}", song)
        .replace("{artist}", artist)
        .replace("{img}", img)
        .replace("{playcount}", playcount)
        .replace("{topArtist}", topArtistName)
        .replace("{topArtistStreams}", topArtistStreams)
        .replace("{artistImg}", topArtistImg)
        .replace("{topSongArtist}", topSongArtist)
        .replace("{topSongName}", topSongName)
        .replace("{topSongImg}", topSongImg);

    await fs.writeFile("README.md", readme);
}

main();