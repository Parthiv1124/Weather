const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal)=> {
    let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    return temperature
};

const server = http.createServer((req, res) => {
    if (req.url == "/") {
     requests(
        "https://api.openweathermap.org/data/2.5/weather?q=vadodara&appid=85d0c59ecea3d5072fefcf97a3928f28"
     ) 
     .on("data", chunk =>
        {
            const objdata = JSON.parse(chunk);
            const arrData = [objdata];
            objdata.main.temp = Math.floor(objdata.main.temp - 273.15);
            objdata.main.feels_like = Math.floor(objdata.main.feels_like - 273.15);
            objdata.main.temp_min = Math.floor(objdata.main.temp_min - 273.15);
            objdata.main.temp_max = Math.floor(objdata.main.temp_max - 273.15);
            
            const realTimeData = arrData.map(val=>replaceVal(homeFile, val)).join("");
            res.write(realTimeData);
        })
     .on("end", (err)=>{
            if(err) return console.log("conn",err);

            res.end()
        })
    }
});

server.listen(8088);