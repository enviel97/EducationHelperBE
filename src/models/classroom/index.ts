import Modal from "./classroom.model";
import { Sorted } from "../../helper/type.helper";
import MemberModal from "../member/member.model";

interface Props {
  name?: string;
  members?: string[];
  exams?: string[];
}

export default class Classroom {
  private props: Props;
  constructor() {}
  public static with(props: Props): Classroom {
    const _class = new Classroom();
    _class.props = props;
    return _class;
  }
  //#region classroom

  public async findAll(creatorId: string, sorted?: Sorted) {
    const result = await Modal.find({ creatorId }, null, {
      sort: sorted,
    }).catch((err) => {
      console.log(`[Error get all classroom]:\n${err}`);
      return null;
    });
    if (!result) return Promise.reject("Somthing wrong with classroom data");

    const members = await Promise.all(
      result.map(async (classroom) => {
        const member = await MemberModal.find(
          { classId: classroom.id ?? classroom._id },
          { lastName: 1, firstName: 1, mail: 1, phoneNumber: 1 }
        );
        return member;
      })
    );

    return result.map((classroom, index) => {
      return { ...classroom.toObject(), members: members[index] };
    });
  }

  public async create(accountId: string) {
    const { name } = this.props!;
    const modal = new Modal({
      creatorId: accountId,
      exams: [],
      memebers: [],
      name: name ?? "",
    });
    const result = await modal.save().catch((error) => {
      console.log(`[Classroom create error]:\n${error}`);
      return null;
    });
    if (!result) return Promise.reject("Can't create classroom");

    return result;
  }

  public async get(id: string) {
    const result = await Modal.findById(id).catch((err) => {
      console.log(`[Classroom get error]:\n${err}`);
      return null;
    });
    if (!result) return Promise.reject("Can't get classroom");
    return result;
  }

  public async update(id: string) {
    const { name } = this.props!;
    const result = await Modal.findByIdAndUpdate(id, { name }).catch((err) => {
      console.log(`[Update classroom]:${err}`);
      return null;
    });
    if (!result) return Promise.reject("Can't update classroom");
    return result;
  }

  public async delete(id: string) {
    const result = await Modal.findByIdAndDelete(id).catch((err) => {
      console.log(`[Delete classroom]: ${err}`);
      return null;
    });
    if (!result) return Promise.reject("Can't delete classroom");
    return result;
  }

  public async search(query: object, sorted?: Sorted) {
    const result = await Modal.find(query, null, { sort: sorted }).catch(
      (err) => {
        console.log(`[Search Error]: ${err}`);
        return null;
      }
    );
    if (!result) return null;
    return result;
  }

  public async getWith(creatorId: string, limit: number, sorted?: Sorted) {
    const result = await Modal.find({ creatorId }, null, {
      sort: sorted,
      limit: limit,
    }).catch((err) => {
      console.log(`[Error get limit classroom]:\n${err}`);
      return null;
    });
    if (!result) return Promise.reject("Somthing wrong with classroom data");
    return result.map((classroom) => {
      return classroom.toObject();
    });
  }
  //#endregion
}
