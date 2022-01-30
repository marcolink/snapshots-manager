import {
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration
} from "remix";

export default function App() {
    return (
        <html lang="en">
        <head>
            <meta charSet="utf-8"/>
            <Meta/>
            <Links/>
        </head>
        <body>
        <Outlet/>
        <ScrollRestoration/>
        <Scripts/>
        {process.env.NODE_ENV === "development" && <LiveReload/>}
        </body>
        </html>
    );
}
