import { Member } from "../../../models/classroom/classroom.types";

export const isMemberEqual = (x: Member, y: Member) => {
  return (
    x.firstName.toLowerCase() === y.firstName.toLowerCase() &&
    x.lastName.toLowerCase() === y.lastName.toLowerCase() &&
    x.gender === y.gender &&
    x.mail === y.mail &&
    x.phoneNumber === y.phoneNumber &&
    x.birth === y.birth
  );
};
