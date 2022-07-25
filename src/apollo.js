import ApolloClient from 'apollo-boost';

export default new ApolloClient({
  uri:
    (process.env.REACT_APP_API_URL !== undefined ? process.env.REACT_APP_API_URL : '') + '/graphql'
});
