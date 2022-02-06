import { filterFile, verifyAccount, verifyFile } from "../../../helper/utils";

export default {
  verify: [verifyAccount, verifyFile],
  filterFile,
};
