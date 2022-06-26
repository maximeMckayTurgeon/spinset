const axios = require("axios");

exports.handler = async function (event, context) {
    console.log(event);
    console.log(context);
    try {
        const { page } = event.queryStringParameters;
        const response = await axios.get(
            `${process.env.DISCOGS_BASE_URL}&page=${page}`
        );
        return {
            statusCode: 200,
            body: JSON.stringify(response.data)
        };
    } catch (err) {
        return {
            statusCode: 404,
            body: err.toString()
        };
    }
};
