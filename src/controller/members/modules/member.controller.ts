import { Response, Request } from "express";
import { error, success } from "../../../helper/https";
import Classroom from "../../../models/classroom";
import Member from "../../../models/member";

const classRepo = new Classroom();
const memberRepo = new Member();

/// getAll
export const findAll = async (req: Request, res: Response) => {
  const { idClassroom } = req.params;
  const classroom = await classRepo.get(idClassroom).catch((err) => {
    error(res).BADREQUEST(err);
    return null;
  });
  if (!classroom) return;
  const result = await memberRepo.findAll(classroom.id).catch((err) => {
    error(res).BADREQUEST(err);
    return null;
  });
  if (!result) return;
  success(res).ACCEPTED({
    classname: classroom.name,
    totalExams: classroom.exams.length,
    members: result,
  });
};

/// create
export const insertMember = async (req: Request, res: Response) => {
  const { avatar, firstName, lastName, gender, phoneNumber, mail, birth } =
    req.body;

  const { idClassroom } = req.params;

  const result = await memberRepo
    .addOnce(
      idClassroom,
      avatar,
      firstName,
      lastName,
      gender,
      phoneNumber,
      mail,
      birth
    )
    .catch((err) => {
      error(res).BADREQUEST(err);
      return null;
    });

  if (!result) return;
  success(res).CREATED(result);
};

/// inserts multi
export const insertMembers = async (req: Request, res: Response) => {
  const { members } = req.body;
  const { idClassroom } = req.params;
  const memberList = (members as []).map((m: any) => {
    m.classId = idClassroom;
    return m;
  });
  const result = await memberRepo.addMany(memberList).catch((err) => {
    error(res).BADREQUEST(err);
    return null;
  });

  if (!result) return;
  success(res).CREATED(result);
};

/// edit
export const updateMember = async (req: Request, res: Response) => {
  const { avatar, firstName, lastName, gender, phoneNumber, mail, birth } =
    req.body;
  const { idMember } = req.params;

  const result = await memberRepo
    .updateOnce(idMember, {
      avatar,
      firstName,
      lastName,
      gender,
      phoneNumber,
      mail,
      birth,
    } as any)
    .catch((err) => {
      error(res).BADREQUEST(err);
      return null;
    });

  if (!result) return;
  success(res).CREATED(result);
};

/// delete
export const deleteMember = async (req: Request, res: Response) => {
  const { idMembers } = req.params;
  const result = await memberRepo.deleteOnce(idMembers).catch((err) => {
    error(res).BADREQUEST(err);
    return null;
  });

  if (!result) return;
  success(res).CREATED(result);
};

/// clearAll
export const deleteMembers = async (req: Request, res: Response) => {};
