import React, { Component } from "react";
import { Button, Container } from "react-bootstrap";

import PostViewer from "./PostViewer";
import PostEditor from "./PostEditor";

class PostHome extends Component {
  state = {
    editing: null,
  };
  render() {
    const { editing } = this.state;

    return (
      <Container fluid>
        <Button
          className="my-2"
          color="primary"
          onClick={() => this.setState({ editing: {} })}
        >
          New Post
        </Button>
        <PostViewer
          canEdit={() => true}
          onEdit={(post) => this.setState({ editing: post })}
        />
        {editing && (
          <PostEditor
            post={editing}
            onClose={() => this.setState({ editing: null })}
          />
        )}
      </Container>
    );
  }
}

export default PostHome;
