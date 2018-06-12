import * as React from "react";
import "./styles/main.scss";
import axios from "axios";
export class RootComponent extends React.Component<any, { fromServer: string }> {
    async componentWillMount() {
        const response = await axios.get("/api/test");
        this.setState({ fromServer: response.data })
    }
    public render() {
        const response = this.state && this.state.fromServer;
        return (
            <div className="main">
                <div className="logo"></div>
                <div>
                    <pre>
                        { response && JSON.stringify(this.state.fromServer, null, 2)}
                    </pre>
                </div>
            </div>
        )
    }
}