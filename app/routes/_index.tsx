import {type MetaFunction} from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import {useAppSdkRouter} from "~/hooks/useAppSdkRouter";

export const meta: MetaFunction = () => {
  return [
    {title: "Snapshot Manager"},
    {name: "description", content: "Welcome to Remix!"},
  ];
};

export default function Index() {
  useAppSdkRouter()
  return <Outlet />;
}
