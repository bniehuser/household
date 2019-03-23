import * as React from 'react';

import gql from "graphql-tag";
import { Query } from "react-apollo";

const MEMBER = gql`
  {
    member {
      firstName
      lastName
      alias
      email
      memberships {
        householdName
        householdId
        household {
          memberships {
            memberName
          }
        }
      }
    }
  }
`;

export default (props: any) => (
    <Query query={MEMBER}>
        {({ loading, error, data }) => {
            if (loading) return "Loading...";
            if (error) return `Error! ${error.message}`;

            return props.children({...props, data})
        }}
    </Query>
);