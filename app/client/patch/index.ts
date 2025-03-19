import {createPatch} from "./create-patch";
import {getPatches} from "./get-patches";
import {getPatchesCount} from "~/client/patch/get-patches-count";

export const patchClient = {
  create: createPatch,
  getMany: getPatches,
  getCount: getPatchesCount
}