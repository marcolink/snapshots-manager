import {type MetaFunction} from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import {useAppSdkRouter} from "~/frontend/hooks/useAppSdkRouter";

export const meta: MetaFunction = () => {
  return [
    {title: "Time Machine"},
    {name: "description", content: "A time machine app"},
  ];
};

export default function Index() {
  useAppSdkRouter()
  return <Outlet />;
}
