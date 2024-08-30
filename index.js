"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const annonces_1 = __importDefault(require("./app/routes/annonces"));
const fiches_1 = __importDefault(require("./app/routes/fiches"));
const app = (0, express_1.default)();
const port = 3000;
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use('/annonces', annonces_1.default);
app.use('/fiches', fiches_1.default);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
