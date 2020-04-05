import React from "react";
import "./App.scss";
import { Dropdown, ListGroup } from "react-bootstrap";

const User = "users";
const Post = "post1";
const users = [
  {
    user_id: 1,
    name: "Iwashita",
    iine: 100,
    receive_iine: 0,
    image: "images/abusoru.gif",
  },
  {
    user_id: 2,
    name: "Kawasaki",
    iine: 100,
    receive_iine: 0,
    image: "images/burakki-.gif",
  },
  {
    user_id: 3,
    name: "Baba",
    iine: 100,
    receive_iine: 0,
    image: "images/koikingu.gif",
  },
  {
    user_id: 4,
    name: "Honda",
    iine: 100,
    receive_iine: 0,
    image: "images/metamon.gif",
  },
  {
    user_id: 5,
    name: "Fujikawa",
    iine: 100,
    receive_iine: 0,
    image: "images/rukario.gif",
  },
];
localStorage.setItem(User, JSON.stringify(users));

class App extends React.Component {
  constructor(props) {
    super(props);
    const selectedUsers = get_users();
    const current_posts = get_posts();
    this.state = {
      user: selectedUsers[0],
      posts: current_posts,
    };
    console.log(this.state.posts);
  }

  change_user(user_id) {
    const Users = get_users();
    //配列から添え字の番号のユーザーを取得する。
    const arrNum = user_id - 1;
    this.setState({
      user: Users[arrNum],
    });
  }

  addPosts(e) {
    e.preventDefault();
    let posts = this.state.posts;
    const postElement = e.target.elements["post"];
    const post = {
      praised_user: this.state.praised_user,
      post_user: this.props.user,
      text: postElement.value,
      favorited: 0,
    };
    posts.push(post);
    console.log(posts);
    localStorage.setItem(Post, JSON.stringify(posts));
    postElement.value = "";
    const current_posts = get_posts();
    this.setState({
      posts: current_posts,
    });
    console.log(this.state.posts);
  }

  render() {
    return (
      <React.Fragment>
        <Header
          user={this.state.user}
          change_user={(user_id) => this.change_user(user_id)}
        />
        <PostForm
          user={this.state.user}
          text=""
          posts={this.state.posts}
          addPost={(e) => this.addPosts(e)}
        />
        <PostList user={this.state.user} posts={this.state.posts} />
      </React.Fragment>
    );
  }
}

class Header extends React.Component {
  setDropDown() {
    return users.map((user) => (
      <Dropdown.Item
        key={user.user_id}
        onClick={() => this.props.change_user(user.user_id)}
      >
        {user.name}
      </Dropdown.Item>
    ));
  }

  render() {
    return (
      <header>
        <div className="headerContent">
          <div className="userProfile">
            <img
              src={`${process.env.PUBLIC_URL}/${this.props.user.image}`}
              alt="Icon"
            />
            <p>{this.props.user.name}</p>
            <p>いいねできる数:{this.props.user.iine}</p>
            <p>いいねされた数:{this.props.user.receive_iine}</p>
          </div>
          <Dropdown className="userSelect">
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              You Can Select User
            </Dropdown.Toggle>
            <Dropdown.Menu>{this.setDropDown()}</Dropdown.Menu>
          </Dropdown>
        </div>
      </header>
    );
  }
}

class PostForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      praised_user: this.props.user,
      user: this.props.user,
    };
    this.text = "";
    console.log(this.state.praised_user);
  }

  setDropDownPost() {
    return users.map((user, index) => (
      <Dropdown.Item key={index} onClick={() => this.set_praised_user(user)}>
        {user.name}
      </Dropdown.Item>
    ));
  }

  set_praised_user(user) {
    this.setState({
      praised_user: user,
    });
  }

  render() {
    return (
      <div className="postBody">
        <div className="postSideBar">
          <div className="postUserProfile">
            <img
              src={`${process.env.PUBLIC_URL}/${this.state.praised_user.image}`}
              alt="Icon"
            />
            <p>{this.state.praised_user.name}</p>
            <p>いいねできる数:{this.state.praised_user.iine}</p>
            <p>いいねされた数:{this.state.praised_user.receive_iine}</p>
          </div>
          <Dropdown className="postDrop">
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              You Can Select User
            </Dropdown.Toggle>
            <Dropdown.Menu>{this.setDropDownPost()}</Dropdown.Menu>
          </Dropdown>
        </div>
        <form className="postForm" onSubmit={(e) => this.props.addPost(e)}>
          <textarea
            id="post"
            placeholder="感謝を伝えよう"
            defaultValue={this.props.text}
          />
          <button type="submit" disabled={false}>
            感謝を拡散する
          </button>
          <input value="更新" type="submit" disabled={false} />
        </form>
      </div>
    );
  }
}

class PostList extends React.Component {
  setPostList() {
    const posts = this.props.posts;
    return posts.map((post, index) => (
      <ListGroup.Item key={index} variant="info">
        Info
      </ListGroup.Item>
    ));
  }

  render() {
    return <div className="postList">{this.setPostList()}</div>;
  }
}

class PostItem extends React.Component {
  render() {
    return <div></div>;
  }
}

// function set_user(x) {
//   x.setState({
//     user: x.props.user,
//   });
// }

function get_users() {
  const Users = JSON.parse(localStorage.getItem(User));
  return Users;
}

function get_posts() {
  const Posts = localStorage.getItem(Post);
  const current_posts = Posts ? JSON.parse(Posts) : [];
  return current_posts;
}

export default App;
