import {
  FirebaseResponse,
  pdfExtractOffset,
  storeMediaToFirebase,
} from "../../controller/exams/ultils";
import { Token } from "../../helper/jsontoken";
import { ExamType, IQuest } from "./exam.types";
import Model from "./exam.model";
import { removeMediaInFilebase } from "../../controller/exams/ultils/firebase-storage";
import { Sorted } from "../../helper/type.helper";

interface Props {
  authenticate: string;
  examType: string;
  subject: string;
  file: Express.Multer.File;
}

export default class Exam {
  private props: Props;
  constructor() {}
  public static with(props: Props): Exam {
    const model = new Exam();
    model.props = props;
    return model;
  }

  private async getOffsetContent(): Promise<IQuest[][] | undefined> {
    const { file, examType } = this.props;
    const mimetype = this.props.file.mimetype.toLowerCase();
    if (mimetype.includes("pdf") && examType === ExamType.QUIZ)
      return await pdfExtractOffset(file.buffer);
    return undefined;
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

  public async create() {
    const { authenticate, file, examType, subject } = this.props;
    try {
      const fResponse = await this.getFirebaseResponse(file).catch((error) => {
        console.log(error);
        return null;
      });
      if (!fResponse) return Promise.reject("Can't store file");
      const id = Token.decode(authenticate)!;
      const exam = {
        creatorId: id,
        subject: subject,
        examType: examType as any,
        content: {
          name: fResponse.name,
          originName: file.originalname,
          download: fResponse.download,
          public: fResponse.public,
          offset: await this.getOffsetContent(),
        },
      };
      const result = await new Model(exam).save();

      return result;
    } catch (error) {
      console.log(`[Exam] create error\n${error}`);
      return Promise.reject("Can't create exams");
    }
  }

  public async delete(id: string) {
    const exam = await Model.findByIdAndDelete(id).catch((error) => {
      console.log(error);
      return null;
    });

    if (!exam) return Promise.reject("Can't remove exam");
    console.log(exam.content.name);
    const result = await removeMediaInFilebase(exam.content.name).catch(
      (error) => {
        console.log(error);
        return null;
      }
    );
    if (!result)
      return Promise.reject(
        "Can't remoive media in strore, please call dev to remove"
      );

    return exam;
  }

  public async findAll(creatorId: string, sorted?: Sorted) {
    const result = await Model.find({ creatorId }, null, {
      sort: sorted,
    }).catch((error) => {
      console.log(error);
      return null;
    });

    if (!result) return Promise.reject("Can't get exams");
    return result;
  }

  public async findOnce(id: string) {
    const result = await Model.findById(id).catch((error) => {
      console.log(error);
      return null;
    });

    if (!result) return Promise.reject("Can't get exam");
    return result;
  }

  public async search(query: object, sorted?: Sorted) {
    const result = await Model.find(query, null, { sort: sorted }).catch(
      (err) => {
        console.log(`[Search Error]: ${err}`);
        return null;
      }
    );
    if (!result) return null;
    return result;
  }

  public async getWith(creatorId: string, limit: number, sorted?: Sorted) {
    const result = await Model.find({ creatorId }, null, {
      sort: sorted,
      limit: limit,
    }).catch((err) => {
      console.log(`[Error get limit exams]:\n${err}`);
      return null;
    });
    if (!result) return Promise.reject("Somthing wrong with exams data");
    return result.map((classroom) => {
      return classroom.toObject();
    });
  }

  // update
  public async update(
    id: string,
    subject?: string,
    file?: Express.Multer.File
  ) {
    if (!subject && !file) return Promise.reject("Don't have any data update");
    let exam = await Model.findById(id).catch((error) => {
      console.log(error);
      return null;
    });
    if (!exam) return Promise.reject("Can't found exam");

    if (!!subject && exam.subject !== subject) {
      exam.subject = subject!;
    }

    if (!!file) {
      const content = await this.getFirebaseResponse(file).catch((error) => {
        console.log(error);
        return undefined;
      });
      if (!content) return Promise.reject("Can't storage new exam");
      const remove = await removeMediaInFilebase(exam.content.name).catch(
        (error) => null
      );
      if (!remove) return Promise.reject("Can't remove exam");
      exam.content.originName = file.filename ?? file.originalname;
      exam.content.name = content!.name;
      exam.content.download = content!.download;
      exam.content.public = content!.public;
    }
    const result = await exam.save().catch((error) => {
      console.log(`[Error]: ${error}`);
      return null;
    });
    if (!exam) return Promise.reject("Can't update exam");
    return result;
  }
}
