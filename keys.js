console.log("this is loaded");

exports.spotify ={
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
};
exports.omdb = {
     key: process.env.omdb
}
exports.bandsintown = {
   APP_ID: codingbootcamp
}