import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Table } from 'reactstrap';

export const GET_POSTS = gql`
  query GetPosts {
    posts {
      id
      author
      body
    }
  }
`;

export default () => (
    <div>
        <Query query={GET_POSTS}>
            {({ loading, data }) =>
                (!loading && data !== undefined && data.posts !== undefined) ?
                    (
                        <Table>
                            <thead>
                                <tr>
                                    <th>Author</th>
                                    <th>Body</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.posts.map(post => (
                                    <tr key={post.id}>
                                        <td>{post.author}</td>
                                        <td>{post.body}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )
                    : <p>Something went wrong!</p>}
        </Query>
        <hr />
        <p>Environment  = {process.env.NODE_ENV}</p>
    </div>
);