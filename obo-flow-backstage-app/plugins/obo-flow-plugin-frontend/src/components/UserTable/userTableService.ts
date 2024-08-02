import { Result, User, UserRole } from './types';
import { FetchProps } from '../../commons/types';

export const getUsersByRole = async (
  userRole: UserRole,
  { token, baseUrl, endpoint }: FetchProps,
): Promise<User[]> => {
  const response = await fetch(`${baseUrl}/api/obo-flow-plugin/proxy`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    method: 'POST',
    body: JSON.stringify({
      endpoint: `${endpoint}/${userRole.valueOf()}`,
    }),
  });

  const res = (await response.json()) as Result<User[]>;
  return res.result.map((user: any) => ({
    ...user,
    userRole: UserRole[user.userRole] || UserRole.User,
  }));
};

export const convertUserRoleToName = (userRole: UserRole) => {
  switch (userRole) {
    case UserRole.User:
      return 'Normal users';
    case UserRole.Moderator:
      return 'Moderators';
    case UserRole.Admin:
      return 'Admins';
    default:
      return 'Invalid role';
  }
};
