import { Route } from 'fuse-http';

@Route("/api/test/")
export class TestRoute {
    public get(res) {
        return {
            hello: "world",
            location: "src/server/routes/TestRoute.ts"
        }
    }
}