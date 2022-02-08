import { Classroom } from "../classroom/classroom.types";
import { IExam } from "../exams/exam.types";
import Modal from "./topic.model";
import { ITopic } from "./topic.type";

export default class Topic {
  constructor() {}
  public static with(): Topic {
    const _class = new Topic();
    return _class;
  }

  public async findAll(id: string, props?: { limit: number }) {
    const result = await Modal.find({ creatorId: id }, null, {
      sort: { expiredDate: 1 },
      limit: props?.limit ?? undefined,
    })
      .lean()
      .populate([
        {
          path: "classroom",
          select: {
            name: 1,
            size: 1,
          },
        },
        { path: "exam" },
        { path: "answers", select: { _id: 1, member: 1, status: 1 } },
      ])
      .catch((err) => {
        console.log(`[Error get all topic]:\n${err}`);
        return null;
      });
    if (!result) return Promise.reject("Somthing wrong with topic data");
    return result;
  }

  public async findOnce(id: string) {
    const result = await Modal.findById(id)
      .lean()
      .populate([
        { path: "classroom", select: { name: 1, size: 1 } },
        { path: "exam" },
      ])
      .select({ classroom: 1, expiredDate: 1, createdAt: 1, note: 1 })
      .catch((err) => {
        console.log(`[Error get topic]:\n${err}`);
        return null;
      });
    if (!result) return Promise.reject("Somthing wrong with topic data");
    return result;
  }

  public async create(data: ITopic) {
    const topic = new Modal({ ...data, answers: [] });
    const result = await topic.save().catch((err) => {
      console.log(`[Create topic error]: ${err}`);
      return null;
    });
    if (!result) return Promise.reject("Somthing wrong when create topic");

    const vituralTopic = await result
      .populate({ path: "classroom exam" })
      .catch((err) => {
        console.log(`[Visual topic error]: ${err}`);
        return null;
      });

    if (!vituralTopic) {
      return Promise.reject("Somthing wrong with ref topic");
    }
    return vituralTopic;
  }

  public async update(
    id: string,
    props: {
      expiredDate?: Date;
      note?: string;
    }
  ) {
    const { expiredDate, note } = props;
    if (!expiredDate && !note) return Promise.reject("Don't have value update");
    const update = {};
    if (!!expiredDate) {
      const date = new Date(expiredDate);
      if (isNaN(date.getDate())) {
        return Promise.reject("Expired day is invalid");
      }
      (update as any)["expiredDate"] = expiredDate;
    }
    if (!!note) (update as any)["note"] = note;
    const result = await Modal.findByIdAndUpdate(id, update).catch((err) => {
      console.log(`[Update topic error]: ${err}`);
      return null;
    });
    if (!result) return Promise.reject("Somthhing wrong when update topic");
    return result;
  }

  public async delete(id: string) {
    const result = await Modal.findByIdAndDelete(id).catch((err) => {
      console.log(`[Delete topic error]: ${err}`);
      return null;
    });
    if (!result) return Promise.reject("Somthhing wrong when delete topic");
    return result;
  }

  public async search(query: string, date?: { from: Date; to: Date }) {
    const result = await Modal.find(
      !!date
        ? {
            expiredDate: {
              $gte: date.from,
              $lt: date.to,
            },
          }
        : {}
    )
      .lean()
      .populate([{ path: "classroom exam" }])
      .then((exam) => {
        const reg = new RegExp(query);
        return exam.filter(
          (topic) =>
            reg.test((topic.classroom as any as Classroom).name) ||
            reg.test((topic.exam as any as IExam).subject) ||
            reg.test((topic.exam as any as IExam).content.originName) ||
            reg.test((topic.exam as any as IExam).content.name)
        );
      })
      .catch((err) => {
        console.log(`[Search topic error]: ${err}`);
        return null;
      });
    if (!result) return Promise.reject("Somthhing wrong when search topic");
    return result;
  }

  public async getMembers(id: string) {
    const result = await Modal.findById(id)
      .lean()
      .populate([
        {
          path: "classroom",
          select: { name: 1, members: 1 },
          populate: {
            path: "members",
            options: { sort: { firstName: 1, lastName: 1 } },
          },
        },
        { path: "answers" },
      ])
      .select({ classroom: 1, answers: 1 })
      .catch((err) => {
        console.log(`[Error get topic]:\n${err}`);
        return null;
      });
    if (!result) return Promise.reject("Somthing wrong with topic data");
    return result;
  }
}
