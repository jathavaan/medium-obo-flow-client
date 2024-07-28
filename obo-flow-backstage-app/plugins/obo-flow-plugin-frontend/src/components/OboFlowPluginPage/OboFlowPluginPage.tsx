import React, { useState } from 'react';
import { Button, Grid, Typography } from '@material-ui/core';
import { Content, Header, InfoCard, Page } from '@backstage/core-components';
import { UserTable } from '../UserTable';
import { UserRole } from '../UserTable/types';

export const OboFlowPluginPage = () => {
  const [userRole, setUserRle] = useState<UserRole>(UserRole.User);

  return (
    <Page themeId="tool">
      <Header title="Welcome to obo-flow-plugin-frontend!" />
      <Content>
        <Grid container spacing={3} direction="column">
          <Grid item>
            <InfoCard title="Click on a button below to select a user role">
              <Typography variant="body1">Users fetched from API A</Typography>
            </InfoCard>
          </Grid>

          <Grid item>
            <InfoCard>
              <Grid container spacing={3} direction="row">
                <Grid
                  item
                  md={4}
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setUserRle(UserRole.User)}
                  >
                    <Typography variant="body1">Show normal users</Typography>
                  </Button>
                </Grid>
                <Grid
                  item
                  md={4}
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setUserRle(UserRole.Moderator)}
                  >
                    <Typography variant="body1">Show moderators</Typography>
                  </Button>
                </Grid>
                <Grid
                  item
                  md={4}
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setUserRle(UserRole.Admin)}
                  >
                    <Typography variant="body1">Show admins</Typography>
                  </Button>
                </Grid>
              </Grid>
            </InfoCard>
          </Grid>
          <Grid item>
            <UserTable userRole={userRole} />
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
