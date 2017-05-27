const axios = require("axios");
const fs = require("fs");
const sharp = require("sharp");
exports.run = (client, message, params) => {
        let lat = 0;
        let long = 0;
        let map = null;
        axios.get("https://api.wheretheiss.at/v1/satellites/25544")
            .then(function (response) {
                lat = response.data.latitude;
                long = response.data.longitude;
                console.log(lat +" "+long);
                console.log("http://staticmap.openstreetmap.de/staticmap.php?center="+lat+","+long+"&zoom=4&size=400x400&maptype=mapnik&markers="+lat+","+long+",ltblu-pushpin");
                axios.get("http://staticmap.openstreetmap.de/staticmap.php?center="+lat+","+long+"&zoom=4&size=400x400&maptype=mapnik&markers="+lat+","+long+",ltblu-pushpin", {responseType:'stream'})
                    .then(function (response) {
                        //response.data.pipe(fs.createWriteStream('./issmap.png'));
                        console.log(__dirname);

                            sharp('./ISS.png')
                              .overlayWith('./ISS.png', { gravity: sharp.gravity.centre } )
                              .png({'quality': 90})
                              .toFile('whereisiss.png', function(err) {
                                  console.log(err);
                                  console.log(__dirname);
                                  message.reply('./../whereisiss.png');
                                // outputBuffer contains upside down, 300px wide, alpha channel flattened
                                // onto orange background, composited with overlay.png with SE gravity,
                                // sharpened, with metadata, 90% quality WebP image data. Phew!
                              });
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            })
            .catch(function (error) {
                console.log(error);
            });

};

exports.conf = {
    enabled: true,
    guildOnly: false,
    permLevel: 0
};

exports.help = {
    name: 'iss',
    description: 'Donne la météo du lendemain pour la ville demandée',
    usage: 'image <mot> [<time>||<viral>||<top> - default to time]'
};
