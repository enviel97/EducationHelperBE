import { Member, IClassroomSchema } from "./classroom.types";
import Modal from "./classroom.model";
import { defaultAvatar } from "../../helper/utils";
import { Sorted } from "../../helper/type.helper";
import { v4 as uuid } from "uuid";
import { isMemberEqual } from "../../controller/classroom/ultils/ultils";

interface Props {
  name?: string;
  members?: Member[];
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
    return result.map((classroom) => {
      return {
        ...classroom.toObject(),
        members: classroom.members.map((member) => {
          return {
            uid: member.uid,
            firstName: member.firstName,
            lastName: member.lastName,
            gender: member.gender,
          };
        }),
      };
    });
  }

  public async create(accountId: string) {
    const { members, exams, name } = this.props!;
    const modal = new Modal({
      size: members?.length ?? 0,
      creatorId: accountId,
      exams: exams ?? [],
      memebers: members ?? [],
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

  //#endregion
  //#region memeber

  private async handleClassroomMember(
    id: string,
    handler: (classroom: IClassroomSchema) => Promise<void>
  ) {
    const classroom = await Modal.findById(id).catch((err) => {
      console.log(`[Add member] ${err}`);
      return null;
    });
    if (!classroom) return Promise.reject("Can't find classroom");
    const member = await handler(classroom).catch((error) => `${error}`);
    if ((typeof member).toLowerCase() === "string") {
      return Promise.reject(member);
    }
    const result = await classroom.save().catch((err) => {
      console.log(`[update members]\n${err}`);
      return null;
    });
    if (!result) return Promise.reject("Can't update classroom");
    return { members: result.members };
  }

  public async getMembers(id: string) {
    const classroom = await Modal.findById(id).catch((err) => {
      console.log(`[Get member class]: ${err}`);
      return null;
    });
    if (!classroom) return Promise.reject("Can't find classroom");
    return { members: classroom.members };
  }

  public async addMemeber(id: string) {
    return this.handleClassroomMember(id, async (classroom) => {
      const { members = [] } = this.props!;
      members.forEach((member) => {
        const mem = classroom.members.findIndex((m) => {
          return isMemberEqual(m, member);
        });
        if (mem < 0)
          classroom.members.push({ ...member, uid: `member-${uuid()}` });
      });
    });
  }

  public async updateMember(id: string) {
    return this.handleClassroomMember(id, async (classroom) => {
      const { members = [] } = this.props!;
      const errors: string[] = [];
      members.forEach((member) => {
        const iMem = classroom.members.findIndex((m) => m.uid === member.uid);
        if (iMem >= 0) classroom.members[iMem] = member;
        else errors.push(member.uid);
      });
      if (errors.length !== 0) {
        return Promise.reject(
          `Member with uid:\n [${errors.join("\n")}] not found`
        );
      }
    });
  }

  public async deleteMember(id: string, uid: string[]) {
    return this.handleClassroomMember(id, async (classroom) => {
      const filter = classroom.members.filter((member) => {
        return !uid.includes(member.uid);
      });
      classroom.members = filter;
    });
  }
  //#endregion
}
