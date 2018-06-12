import { Server } from "fuse-http";
import * as path from "path"

import "./routes/TestRoute"
// should be last
import "./routes/IndexRoute"

// start the server
const server = Server.start({ port: 3001 });
server.static("/static", path.resolve("dist/browser")  )
