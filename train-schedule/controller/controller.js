const axios = require("axios")

let token = "";
let result;

const getData = async() => {
    try{
        let data ;
        const headers = {
            'Authorization' : `Bearer ${token}`
        }
        await axios.get("http://localhost:3000/trains",{
            headers: headers 
        }).then(res => {
            data = res.data;
            console.log(res.data);
        })
        return data;
    }
    catch(error){
        console.log(error);
    }
}


const Register = async(req,res) => {
    try {
        const name = req.body.companyName;
        const companyName = {
            companyName : name
        };
        console.log(companyName);
        await axios.post("http://localhost:3000/register", companyName)
        .then((res)=>{
            result = res.data
            console.log(result);
        })
        res.status(200).json({message: result});
    } catch (error) {
        res.status(400).json({message: error});
    }
}

const GetToken = async(req,res) => {
    try {
        const {companyName,clientID,clientSecret} = req.body;
        const body = {
            companyName,clientID,clientSecret
        }
        let resul;
        await axios.post("http://localhost:3000/auth", body)
        .then((res)=>{
            token = res.data.access_token;
            console.log(token);
            resul = res.data;
        })
        res.status(200).json({message: resul });
    } catch (error) {
        res.status(400).json({message: error});
    }
}

const getTrains = async(req,res) => {
    try {
         let trains ;
         const cacheKey = 'myData';
         const cachedData = await req.app.locals.cache[cacheKey];
         if (cachedData) {
             trains = cachedData;
         }
         else{
            
         const headers = {
             'Authorization' : `Bearer ${token}`
         }
         await axios.get("http://localhost:3000/trains",{
             headers: headers 
         }).then(res => {
             trains = res.data;
         })
             req.app.locals.cache[cacheKey] = trains;
         }

         
        const data = sortPrices(trains);

         

        console.log(data);


        res.json({data:data});
    } catch (error) {
        res.status(400).json({message:"Error"});
    }
};

function sortPrices (trains) {
    const n = trains.length;
         for (let i = 0; i < n - 1; i++) {
           for (let j = 0; j < n - i - 1; j++) {
             if (trains[j].prices.sleeper > trains[j + 1].prices.sleeper || 
                trains[j].prices.AC > trains[j + 1].prices.AC
                ) {
               const temp = trains[j];
               trains[j] = trains[j + 1];
               trains[j + 1] = temp;
             }
           }
         }
         return trains;
        }
        
        
function isTimeWithinNext30Minutes(hour, minute, second) {
    const now = new Date();
    const givenTime = new Date();
    givenTime.setHours(hour);
    givenTime.setMinutes(minute);
    givenTime.setSeconds(second);
  
    const differenceInMinutes = (givenTime.getTime() - now.getTime()) / 1000 / 60;
  
    return differenceInMinutes > 30 ? false : true;
  }

module.exports = {getTrains,Register,GetToken}