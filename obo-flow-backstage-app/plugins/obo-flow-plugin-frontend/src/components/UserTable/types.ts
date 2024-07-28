export enum UserRole {
  User,
  Moderator,
  Admin,
}

export type Result<T> = {
  result: T;
};

export type User = {
  userId: string;
  firstName: string;
  surname: string;
  email: string;
  userRole: UserRole;
};

export type UserTableProps = {
  userRole: UserRole;
};
