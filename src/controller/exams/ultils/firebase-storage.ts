import moment from "moment";
import { v4 as uuid } from "uuid";
import firebase from "../../../config/firebase";

export interface FirebaseResponse {
  name: string;
  download: string;
  public: string;
}

const getType = (filename: string) => {
  const file = filename.split(".");

  switch (file[file.length - 1].toLowerCase()) {
    case "pdf":
      return "PDF";
    case "rar":
      return "RAR";
    case "zip":
      return "ZIP";
    default:
      return "Image";
  }
};
export const storeMediaToFirebase = async (
  file: Express.Multer.File
): Promise<FirebaseResponse> => {
  const date = moment();
  const type = getType(file.originalname);
  try {
    const bucket = firebase.getStorage();
    const name = `${type}/${type}-${uuid()}-${date.format("MM-YYYY")}`;
    const item = bucket.file(name);
    const saveNotification = await item
      .save(file.buffer, { contentType: file.mimetype, public: true })
      .then(() => "Upload successfully")
      .catch((error) => {
        console.log(`[ERROR UPLOAD FILE]:\n${error} `);
        return null;
      });
    if (!saveNotification) {
      return Promise.reject("Can't upload files to server media");
    }
    console.log("[Firebase - process]: # Upload successfully");

    const resPublic = await item.getMetadata().catch((error) => {
      console.log(`[ERROR PUBLIC FILE]:\n${error} `);
      return null;
    });
    if (!resPublic) {
      return Promise.reject("Can't public files on server media");
    }
    console.log("[Firebase - process]: # Public successfully");
    return {
      name: name,
      download: resPublic[0]?.mediaLink ?? "",
      public: item.publicUrl(),
    };
  } catch (error) {
    console.log(`[ERROR UPLOAD FILE]:\n${error} `);
    return Promise.reject("Can't public file on server media");
  }
};

export const removeMediaInFilebase = async (name: string) => {
  try {
    const bucket = firebase.getStorage();
    const removeNotification = await bucket
      .file(name)
      .delete()
      .then(() => {
        console.log(`[Firebase - process]: Remove Successfully`);
        return name;
      })
      .catch((error) => {
        console.log(`[ERROR UPLOAD FILE]: Remove ${error}`);
        return null;
      });
    if (!removeNotification) {
      return Promise.reject("Can't remove file to server media");
    }
    return removeNotification;
  } catch (error) {
    console.log(`[ERROR REMOVE FILE]:\n${error} `);
    return Promise.reject("Can't remove file on server media");
  }
};
