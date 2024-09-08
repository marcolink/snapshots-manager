import { db } from ".";
import {entries} from "~/database/schema";

await db.delete(entries).execute();
