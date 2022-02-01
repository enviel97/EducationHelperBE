import Modal from "./topic.model";
import { ITopic } from "./topic.type";

export default class Topic {
  constructor() {}
  public static with(): Topic {
    const _class = new Topic();
    return _class;
  }

  public async findAll(id: string) {
    const result = await Modal.find({ creatorId: id }, null, {
      sort: { expiredDate: 1 },
    }).catch((err) => {
      console.log(`[Error get all topic]:\n${err}`);
      return null;
    });
    if (!result) return Promise.reject("Somthing wrong with topic data");
    return result;
  }

  public async findOnce(id: string) {
    const result = await Modal.findById(id).catch((err) => {
      console.log(`[Error get topic]:\n${err}`);
      return null;
    });
    if (!result) return Promise.reject("Somthing wrong with topic data");
    return result;
  }

  public async create(data: ITopic) {
    const topic = new Modal({ ...data });
  }

  public async update() {}
  public async delete() {}
}
