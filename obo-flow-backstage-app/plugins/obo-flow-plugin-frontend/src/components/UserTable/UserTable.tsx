import React, { useEffect, useState } from 'react';
import {
  Table,
  TableColumn,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import { getUsersByRole } from './userTableService';
import { User, UserRole, UserTableProps } from './types';
import {
  configApiRef,
  microsoftAuthApiRef,
  useApi,
} from '@backstage/core-plugin-api';
import { FetchProps } from '../../commons/types';

type DenseTableProps = {
  userRoleName: string;
  users: User[];
};

const convertUserRoleToName = (userRole: UserRole) => {
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

export const DenseTable = ({ userRoleName, users }: DenseTableProps) => {
  const columns: TableColumn[] = [
    { title: 'User ID', field: 'userId' },
    { title: 'First name', field: 'firstName' },
    { title: 'Surname', field: 'surname' },
    { title: 'Email', field: 'email' },
  ];

  const data = users.map(user => {
    return {
      userId: user.userId,
      firstName: user.firstName,
      surname: user.surname,
      email: user.email,
    };
  });

  return (
    <Table
      title={userRoleName}
      options={{ search: false, paging: false }}
      columns={columns}
      data={data}
    />
  );
};

export const UserTable = ({ userRole }: UserTableProps) => {
  const config = useApi(configApiRef);
  const microsoftAuthApi = useApi(microsoftAuthApiRef);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>();
  const [users, setUsers] = useState<User[]>([]);
  const [userRoleName, setUserRoleName] = useState<string>(
    convertUserRoleToName(userRole),
  );

  useEffect(() => {
    setUserRoleName(convertUserRoleToName(userRole));
  }, [userRole]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const backendUrl = config.getString('backend.baseUrl');
        const clientToken = await microsoftAuthApi.getAccessToken(
          'backstage-client-id/.default',
        );

        const fetchProps: FetchProps = {
          token: clientToken,
          baseUrl: backendUrl,
          endpoint: 'users',
        };

        setLoading(true);
        const result = await getUsersByRole(userRole, fetchProps);
        setUsers(result);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [config, microsoftAuthApi, userRole]);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return <DenseTable userRoleName={userRoleName} users={users || []} />;
};
