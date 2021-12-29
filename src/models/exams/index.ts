import {
  FirebaseResponse,
  pdfExtractOffset,
  storeMediaToFirebase,
} from "../../controller/exams/ultils";
import { Token } from "../../helper/jsontoken";
import { IExam, IQuest } from "./exam.types";
import Model from "./exam.model";

interface Props {
  authenticate: string;
  examType: string;
  expirTime: Date;
  file: Express.Multer.File;
}

export default class ExamModel {
  constructor(private readonly props: Props) {}

  private get isImage() {
    const mimetype = this.props.file.mimetype.toLowerCase();
    return mimetype.includes("image");
  }

  private async getOffsetContent(): Promise<IQuest[][] | undefined> {
    const { file } = this.props;
    if (this.isImage) return undefined;
    return await pdfExtractOffset(file.buffer);
  }

  private async getFirebaseResponse(): Promise<FirebaseResponse | undefined> {
    const { file } = this.props;
    try {
      return await storeMediaToFirebase(file);
    } catch (error) {
      Promise.reject(error);
    }
  }

  private async createExam(fResponse: FirebaseResponse): Promise<IExam> {
    const { authenticate, file, examType, expirTime } = this.props;
    const id = Token.decode(`${authenticate}`)!;
    return {
      creatorId: id,
      examType: examType as any,
      expirTime: expirTime,
      content: {
        name: fResponse.name,
        originName: file.originalname,
        download: fResponse.download,
        public: fResponse.public,
        offset: await this.getOffsetContent(),
      },
    };
  }

  public async create() {
    try {
      const fResponse = await this.getFirebaseResponse();
      const exam = await this.createExam(fResponse!);
      const result = await new Model(exam).save();
      return result;
    } catch (error) {
      console.log(`[ExamModel] create error\n${error}`);
      return Promise.reject("Can't create exams");
    }
  }
}
