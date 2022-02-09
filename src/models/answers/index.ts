import Model from "./answers.model";
import {
  FirebaseResponse,
  storeMediaToFirebase,
} from "../../controller/exams/ultils";
import { StatusAnswer } from "./answers.type";
import TopicModel from "../topic/topic.model";
import { removeMediaInFilebase } from "../../controller/exams/ultils/firebase-storage";

interface ReqMember {
  topicId: string;
  memberId: string;
  createDate: Date;
  note: string;
  file?: Express.Multer.File;
}
export default class Answer {
  constructor() {}

  private getStatus(createDate: Date, expiredDate?: Date): StatusAnswer {
    let status = StatusAnswer.EMPTY;
    if (!!expiredDate) {
      if (createDate <= expiredDate) status = StatusAnswer.SUBMIT;
      if (createDate > expiredDate) status = StatusAnswer.LATED;
    }
    return status;
  }

  private async getFirebaseResponse(
    file: Express.Multer.File
  ): Promise<FirebaseResponse | undefined> {
    try {
      return await storeMediaToFirebase(file);
    } catch (error) {
      Promise.reject(error);
    }
  }
  // create
  public async create(members: ReqMember) {
    const {
      file,
      topicId,
      memberId,
      createDate = new Date(),
      note = "",
    } = members;

    const fResponse = await this.getFirebaseResponse(file!).catch((error) => {
      console.log(`ANSWER CREATE ERROR STOREFILE: ${error}`);
      return null;
    });

    if (!fResponse) return Promise.reject("Can't store file");

    const topic = await TopicModel.findById(topicId, { expiredDate: 1 });

    const result = await new Model({
      topic: topicId,
      member: memberId,
      status: this.getStatus(createDate, topic?.expiredDate),
      grade: 0.0,
      note: note,
      content: {
        name: fResponse.name,
        originName: file!.originalname,
        download: fResponse.download,
        public: fResponse.public,
      },
    })
      .save({})
      .catch((error) => {
        console.log(`ANSWER CREATE ERROR: ${error}`);
        return null;
      });
    if (!result) {
      return Promise.reject("Can't create answers");
    }
    return result;
  }

  // update
  public async update(id: String, members: ReqMember) {
    const { file = undefined, createDate = new Date(), note = "" } = members;
    if (!createDate && !file && !note)
      return Promise.reject("Don't have any data update");
    let answer = await Model.findById(id, {
      topic: 1,
      content: 1,
      status: 1,
      note: 1,
    }).catch((error) => {
      console.log(error);
      return null;
    });
    if (!answer) return Promise.reject("Can't found answer");
    if (!!file) {
      const fResponse = await this.getFirebaseResponse(file).catch((error) => {
        console.log(`ANSWER CREATE ERROR STOREFILE: ${error}`);
        return null;
      });
      if (!fResponse) return Promise.reject("Can't store file");
      const remove = await removeMediaInFilebase(answer.content.name).catch(
        (error) => null
      );
      if (!remove) return Promise.reject("Can't remove answer file");
      answer.content.originName = file.filename ?? file.originalname;
      answer.content.name = fResponse.name;
      answer.content.download = fResponse.download;
      answer.content.public = fResponse.public;

      const topic = await TopicModel.findById(answer.topic, {
        expiredDate: 1,
      }).lean();
      answer.status = this.getStatus(createDate, topic?.expiredDate);
    }
    if (!!note) {
      answer.note = note;
    }

    const result = await answer.save().catch((err) => {
      console.log(`[Update answer error]: ${err}`);
      return null;
    });
    if (!result) return Promise.reject("Can't update answers");
    return result;
  }

  // delete
  public async delete(id: String) {
    const result = await Model.findByIdAndDelete(id)
      .lean()
      .catch((error) => {
        console.log(`[Delete answers error]: ${error}`);
        return null;
      });

    if (!result) return Promise.reject("Can't delete answers");

    await removeMediaInFilebase(result.content.name).catch((error) => {
      console.log(`[Remove file in filebase]: ${error}`);
      return null;
    });

    return result;
  }

  // findOnce
  public async findOnce(id: String) {
    const result = await Model.findById(id)
      .lean()
      .populate({
        path: "member",
        select: { firstName: 1, lastName: 1, phoneNumber: 1, mail: 1 },
      })
      .catch((error) => {
        console.log(`[Answer get once]: ${error}`);
        return null;
      });

    if (!result) return Promise.reject("Can't found answer");
    return result;
  }

  // grade
  public async grade(id: String, point: number, review: string) {
    let grade = Math.min(Math.max(point, 0), 10);

    const result = await Model.findByIdAndUpdate(id, {
      grade: grade,
      review: review,
    })
      .lean()
      .catch((error) => {
        console.log(`[Grading error] ${error}`);
        return null;
      });
    if (!result) return Promise.reject("Can't grading answers");
    return result;
  }
}
