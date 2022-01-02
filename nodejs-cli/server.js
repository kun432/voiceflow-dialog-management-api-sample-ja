const express = require('express')
const app = express()

const vfDmApi = "https://general-runtime.voiceflow.com/state/";
const keepalive = 3600 // seconds

const config = {
  vfApiKey: process.env.VF_API_KEY,
  vfVersionId: process.env.VF_VERSION_ID
};

const port = process.env.PORT || 3000;

/* Middleware */
app.use(express.urlencoded({extended: false}));
app.use(express.json());

const dotenv = require('dotenv')
dotenv.config();

app.listen(port, () => console.log(`listening on port ${port}`))

const axios = require('axios').default;

const instance = axios.create({
    baseURL: vfDmApi,
    timeout: 2000,
    headers: { Authorization: API_KEY }
})

app.get('/allCountries', async (req, res) => {
    try {
        const countries = await instance.get('countries')
        res.send({ countries: countries.data })
    } catch (error) {
        errorHandler(res, error)
    }
})

const errorHandler = (res, error) => {
    // ここを実装したい
}
