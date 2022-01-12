import { Sorted } from "../../helper/type.helper";
import Modal from "./member.model";
import { Member as IMember } from "./member.types";

export default class Member {
  constructor() {}
  public static with(): Member {
    const _class = new Member();
    return _class;
  }

  public async findAll(id: string, sorted?: Sorted) {
    const result = await Modal.find({ classId: id }, null, {
      sort: sorted,
    }).catch((err) => {
      console.log(`[Error get all members]:\n${err}`);
      return null;
    });
    if (!result) return Promise.reject("Somthing wrong with members data");
    return result;
  }

  public async findOnce(lastName: string, firstName: string) {
    const result = await Modal.findOne({ lastName, firstName }).catch((err) => {
      console.log(`[Error get all members]:\n${err}`);
      return null;
    });
    if (!result) return Promise.reject("Somthing wrong with members data");
    return result;
  }

  public async addOnce(
    classId: string,
    avatar: string,
    firstName: string,
    lastName: string,
    gender: string,
    phoneNumber: string,
    mail: string,
    birth: string
  ) {
    const member = new Modal({
      classId,
      avatar,
      firstName,
      lastName,
      gender,
      phoneNumber,
      mail,
      birth,
    });
    const result = await member.save().catch((error) => {
      console.log(`[Member create error]:\n${error}`);
      return null;
    });
    if (!result) return Promise.reject("Can't create member");
    return result;
  }

  public async addMany(members: Member[]) {
    const result = await Modal.insertMany(members).catch((error) => {
      console.log(`[Members create error]:\n${error}`);
      return null;
    });
    if (!result) return Promise.reject("Can't create members");
    return result;
  }

  public async updateOnce(id: string, member: IMember) {
    const result = await Modal.findByIdAndUpdate(id, {
      avatar: member.avatar,
      firstName: member.firstName,
      lastName: member.lastName,
      gender: member.gender,
      phoneNumber: member.phoneNumber,
      mail: member.mail,
      birth: member.birth,
    }).catch((error) => {
      console.log(`[Member update error]:\n${error}`);
      return null;
    });
    if (!result) return Promise.reject("Can't update member");
    return result;
  }

  public async deleteOnce(id: string) {
    const result = await Modal.findByIdAndDelete(id).catch((error) => {
      console.log(`[Member update error]:\n${error}`);
      return null;
    });
    if (!result) return Promise.reject("Can't delete member");
    return result;
  }

  public async deleteAll(idClass: string) {
    const result = await Modal.deleteMany({ classId: idClass }).catch(
      (error) => {
        console.log(`[Member update error]:\n${error}`);
        return null;
      }
    );
    if (!result) return Promise.reject("Can't delete member");
    return result;
  }
}
