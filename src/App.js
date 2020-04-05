import React from "react";
import "./App.scss";
import { Dropdown, ListGroup } from "react-bootstrap";

const User = "users";
const Post = "postee";
const Favorite = "favorite";
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
    const Users = get_users();
    const current_posts = get_posts();
    const current_favorites = get_favorites();
    this.state = {
      user: Users[0],
      posts: current_posts,
      praised_user: Users[0],
      favorites: current_favorites,
    };
    // console.log(this.state.posts);
  }

  change_user(user_id) {
    const Users = get_users();
    //配列から添え字の番号のユーザーを取得する。
    const arrNum = user_id - 1;
    this.setState({
      user: Users[arrNum],
    });
  }

  set_praised_user(user) {
    this.setState({
      praised_user: user,
    });
  }

  addPosts(e) {
    e.preventDefault();
    const postElement = e.target.elements["post"];
    const current_posts = get_posts();
    console.log(current_posts.length);
    const post = {
      id: current_posts.length + 1,
      praised_user: this.state.praised_user,
      post_user: this.state.user,
      text: postElement.value,
      favorited: 0,
    };
    current_posts.push(post);
    console.log(current_posts);
    localStorage.setItem(Post, JSON.stringify(current_posts));
    postElement.value = "";
    this.setState({
      posts: current_posts,
    });
    // console.log(this.state.posts);
  }

  create_favorite(post) {
    const current_favorites = get_favorites();
    const favorite = {
      id: current_favorites.length + 1,
      post: post,
      user: this.state.user,
    };
    console.log(current_favorites);
    current_favorites.push(favorite);
    localStorage.setItem(Favorite, JSON.stringify(current_favorites));
    this.setState({
      favorites: current_favorites,
    });
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
          setPraisedUser={(user) => this.set_praised_user(user)}
          praised_user={this.state.praised_user}
        />
        <PostList
          user={this.state.user}
          posts={get_posts()}
          onClick={(post) => this.create_favorite(post)}
          favorite={get_favorites()}
        />
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
      <header id="content">
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
  setDropDownPost() {
    return users.map((user, index) => (
      <Dropdown.Item
        key={index}
        onClick={() => this.props.setPraisedUser(user)}
      >
        {user.name}
      </Dropdown.Item>
    ));
  }

  render() {
    return (
      <div className="postBody" id="content">
        <div className="postSideBar">
          <div className="postUserProfile">
            <img
              src={`${process.env.PUBLIC_URL}/${this.props.praised_user.image}`}
              alt="Icon"
            />
            <p>{this.props.praised_user.name}</p>
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
  getThePostFavorite(post) {
    const favorites = get_favorites();
    const relationFavorites = favorites.filter(
      (favorite) => favorite.post.id === post.id
    );
    console.log(favorites);
    return relationFavorites.length;
  }

  setPostList() {
    const posts = get_posts();
    return posts.map((post, index) => (
      <ListGroup.Item key={index} variant="info" className="listItem">
        <div className="listSidebar">
          <div className="listContent">
            <img
              src={`${process.env.PUBLIC_URL}/${post.post_user.image}`}
              alt="Icon"
            />
            <p>{post.post_user.name}</p>
          </div>
          <div className="listContent">
            <img
              src={`${process.env.PUBLIC_URL}images/jjj.jpeg`}
              alt="Icon"
              id="yajirusi"
            />
          </div>
          <div className="listContent">
            <img
              src={`${process.env.PUBLIC_URL}/${post.praised_user.image}`}
              alt="Icon"
            />
            <p>{post.praised_user.name}</p>
          </div>
        </div>
        <div className="Text">
          <div>
            <p>{post.text}</p>
          </div>
          <div>
            <button onClick={() => this.props.onClick(post)}>拍手をする</button>
            <p>{this.getThePostFavorite(post)}個のいいね</p>
          </div>
        </div>
      </ListGroup.Item>
    ));
  }

  render() {
    return (
      <div className="postList" id="content">
        {this.setPostList()}
      </div>
    );
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

function get_favorites() {
  const Favorites = localStorage.getItem(Favorite);
  const current_favorites = Favorites ? JSON.parse(Favorites) : [];
  return current_favorites;
}

export default App;
