// const http = require("http");
const http = require("http")
const fs = require("fs");
var requests = require('requests');

const homefile = fs.readFileSync("home.html", "utf-8");

const realval = (tempval, orgval) => {

    let temprature = tempval.replace("{%tempval%}", (orgval.main.temp-273.15).toFixed(2))
    temprature = temprature.replace("{%tempmax%}", (orgval.main.temp_max-273.15).toFixed(2))
    temprature = temprature.replace("{%tempmin%}", (orgval.main.temp_min-273.15).toFixed(2))
    temprature = temprature.replace("{%location%}", orgval.name)
    temprature = temprature.replace("{%country%}", orgval.sys.country)
    return temprature
}

const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests("https://api.openweathermap.org/data/2.5/weather?q=Gurugram&appid=b8f2cbb3a72e505b9f9665aec0458e73")
            .on('data', (chunk) => {
                const objdata = JSON.parse(chunk)
                const arrdata = [objdata]
                // console.log(arrdata[0].main.temp)
                console.log(arrdata)
                const realtimedata = arrdata.map((val) => realval(homefile, val)).join('')
                // console.log(realtimedata)
                res.write(realtimedata)
            })
            .on('end', (err) => {
                if (err) return console.log('connection closed due to errors', err);

                res.end()
            });
    }
})
server.listen('8000', "127.0.0.1")