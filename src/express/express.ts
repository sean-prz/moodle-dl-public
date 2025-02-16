import express from 'express';
import { Request, Response } from 'express-serve-static-core';
import {
    addCourseID,
    changeCookie,
    checkValidCookie,
    readStorage,
    removeCourseID
} from "../controller/SettingController";
import cors from 'cors';
import bodyParser from "body-parser";
import {WebSocketServer} from "ws";
import {downloadAll} from "../controller/RetrievePdf";

/**
 * Serve the public folder as static files and also act as
 * a REST API to get the settings and modify them.
 * You can also launch the downloader with a POST request.
 */
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



const port = 3000;
const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});


app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});



app.get("/settings", (req: Request, res: Response) => {
    let setting =  readStorage()
    res.send(setting);

});
app.get("/download", async (req: Request, res: Response) => {
    console.log("Received download request");
    res.send("Download started");
    await downloadAll();
    console.log("Downloaded all pdfs");
});

app.get("/checkCookie", (req: Request, res: Response) => {
    checkValidCookie().then((valid) => {
        res.send(valid);
    })
})

app.get("/coursesList", (req: Request, res: Response) => {
    // return the list of courses
    let setting =  readStorage()
    console.log(setting)
    res.send(setting.courses);
})

app.post("/addCourse", (req: Request, res: Response) => {
    // check if the body has a string then call changeCookie
    if (req.body.id !== undefined) {
      addCourseID(req.body.id).then(() => {
            res.send("Course added");
      })
    } else {
        res.send("Invalid course");
    }
})

app.post("/removeCourse", (req: Request, res: Response) => {
    // check if the body has a string then call changeCookie
    if (req.body.id !== undefined) {
        removeCourseID(req.body.id);
        res.send("Course removed");
    } else {
        res.send("Invalid course");
    }
})

app.post("/changeCookie", (req: Request, res: Response) => {
    // check if the body has a string then call changeCookie
    if (req.body.cookie !== undefined) {
        changeCookie(req.body.cookie);
        res.send("Cookie changed");
        console.log("Cookie changed");
    } else {
        console.log(req.body)
        res.send("Invalid cookie");
    }
})

export function runServer() {
    app.listen(port, () => {
        console.log(`Server started at http://localhost:${port}`);
    });
}

export function sendToClient(message: any) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}