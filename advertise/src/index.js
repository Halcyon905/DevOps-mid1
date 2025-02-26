const express = require("express");
const path = require('path');
const amqp = require('amqplib');

if (!process.env.PORT) {
    throw new Error("Please specify the port number for the HTTP server with the environment variable PORT.");
}

if (!process.env.RABBIT) {
    throw new Error("Please specify the name of the RabbitMQ host using environment variable RABBIT");
}

const PORT = process.env.PORT;
const RABBIT = process.env.RABBIT;

//
// Application entry point.
//
async function main() {

    const app = express();

    //
    // Enables JSON body parsing for HTTP requests.
    //
    app.use(express.json()); 

    //
    // Connects to the RabbitMQ server.
    //
    const messagingConnection = await amqp.connect(RABBIT); 

    console.log("Connected to RabbitMQ.");

    //
    // Creates a RabbitMQ messaging channel.
    //
    const messageChannel = await messagingConnection.createChannel(); 
       
    //
    // Asserts that we have a "viewed" queue.
    //
	await messageChannel.assertQueue("viewed", {}) 

    console.log(`Created "viewed" queue.`);

    //
    // HTTP GET route to retrieve advertise page.
    //
    app.get("/advertise", async (req, res) => {
        const skip = parseInt(req.query.skip);
        const limit = parseInt(req.query.limit);
        res.sendFile();
        res.set('Content-Type', 'application/zip');
        res.set('Content-Disposition', `attachment; filename=${archiveName}`);

    
        res.zip(files, "zipped", (err) => {
            if (err) {
            console.log('Error sending files:', err);
            } else {
            console.log('Files sent successfully');
            }
        });
    });

    //
    // Starts the HTTP server.
    //
    app.listen(PORT, () => {
        console.log("Microservice online.");
    });
}

main()
    .catch(err => {
        console.error("Microservice failed to start.");
        console.error(err && err.stack || err);
    });