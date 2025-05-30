import ReactDOMServer from "react-dom/server"
import fs from "fs-extra"
import path from "path"
import { fileURLToPath } from "url"
import {teas} from "../src/data.js"
import App from "../src/App.js"
import React from "react"


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const outDir = path.resolve(__dirname, "../dist")
const htmlTemplatePath = path.resolve(__dirname, "../src/template.html")
const outputHtmlPath = path.resolve(outDir, "index.html")

const template = await fs.readFile(htmlTemplatePath, "utf-8")

const appHtml = ReactDOMServer.renderToStaticMarkup(
    React.createElement(App, {teas})
);

const finalHtml = template.replace("<!--app-->", appHtml);

await fs.ensureDir(outDir)
await fs.writeFile(outputHtmlPath, finalHtml)

// for SSG use renderToStaticMarkup()
// for SSG use renderToString()