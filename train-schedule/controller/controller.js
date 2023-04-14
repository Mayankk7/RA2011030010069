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
         let data ;
         const cacheKey = 'myData';
         const cachedData = await req.app.locals.cache[cacheKey];
         if (cachedData) {
             data = cachedData;
         }
         else{
            
         const headers = {
             'Authorization' : `Bearer ${token}`
         }
         await axios.get("http://localhost:3000/trains",{
             headers: headers 
         }).then(res => {
             data = res.data;
         })
             req.app.locals.cache[cacheKey] = data;
         }
        const fdata = data.filter((i)=>{
            return isTimeWithinNext30Minutes(i.departureTime.Hours,i.departureTime.Minutes + i.delayedBy,i.departureTime.Seconds)
        });

        res.json({data:fdata});
    } catch (error) {
        res.status(400).json({message:"Error"});
    }
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