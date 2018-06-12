const { FuseBox, SassPlugin, CSSResourcePlugin, CSSPlugin, WebIndexPlugin, QuantumPlugin } = require("fuse-box");
const { task, exec, context } = require("fuse-box/sparky");


context(class {
    getBrowserConfig() {
        return FuseBox.init({
            homeDir: "src/client",
            output: "dist/browser/$name.js",
            target: "browser@es5",
            hash: this.isProduction,
            plugins: [
                // handle .scss cases
                // copy resources too
                [
                    SassPlugin(),
                    CSSResourcePlugin({
                        dist: "dist/browser/resources",
                        resolve: f => `/static/resources/${f}`
                    }),
                    CSSPlugin()
                ],
                // handle .css cases
                CSSPlugin(),
                WebIndexPlugin({
                    template: "src/client/index.html",
                    path: "/static/"
                }),
                this.isProduction || this.quantum && QuantumPlugin({
                    bakeApiIntoBundle: "app",
                    uglify: false,
                    treeshake: true,
                })
            ]
        })
    }
    getServerConfig() {
        return FuseBox.init({
            homeDir: "src/server",
            output: "dist/server/$name.js",
            target: "server@esnext"
        })
    }
    createBrowserBundle(fuse) {
        const app = fuse.bundle("app");
        if (!this.isProduction) {
            app.watch()
            app.hmr()
        }
        app.instructions(">index.tsx");
        return app;
    }
    createServerBundle(fuse) {
        const app = fuse.bundle("app");
        if (!this.isProduction) {
            app.watch()
        }
        app
            .completed(proc => proc.start())
            .instructions(">[index.ts]");
        return app;
    }
});

task("dev-browser", async context => {
    const fuse = context.getBrowserConfig();
    fuse.dev({ httpServer: false, port: 3890 });
    context.createBrowserBundle(fuse);
    await fuse.run();
});

task("dev-server", async context => {
    const fuse = context.getServerConfig();
    context.createServerBundle(fuse);
    await fuse.run();
});

task("preview", async context => {
    context.quantum = true;
    await exec("dev-browser")
    await exec("dev-server")
});
task("default", async context => {
    await exec("dev-browser")
    await exec("dev-server")
});