import { Route } from 'fuse-http';
import * as path from "path";

@Route(/^\/(?!static).*$/)
export class MainRoute {
    public get(res) {
        res.sendFile(path.resolve("dist/browser/index.html"))
    }
}