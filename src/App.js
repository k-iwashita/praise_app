import React from "react";
import "./App.scss";
import { Dropdown, ListGroup } from "react-bootstrap";

const User = "users";
const Post = "postfas";
const Favorite = "fafavorites";

const usersList = [
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

// localStorage.setItem(User, JSON.stringify(usersList));
function getUsers() {
  const Users = localStorage.getItem(User);
  let current_users;
  if (Users === null) {
    current_users = localStorage.setItem(User, JSON.stringify(usersList));
    return current_users;
  } else {
    current_users = JSON.parse(Users);
    return current_users;
  }
}

function getPosts() {
  const Posts = localStorage.getItem(Post);
  const current_posts = Posts ? JSON.parse(Posts) : [];
  return current_posts;
}

function getFavorites() {
  const Favorites = localStorage.getItem(Favorite);
  const current_favorites = Favorites ? JSON.parse(Favorites) : [];
  return current_favorites;
}

function getDate() {
  var today = new Date();
  var year = today.getFullYear();
  var month = today.getMonth() + 1;
  var day = today.getDate();
  var datetime = year + "年" + month + "月" + day + "日";
  return datetime;
}

function setData(table, items) {
  localStorage.setItem(table, JSON.stringify(items));
}

class App extends React.Component {
  constructor(props) {
    super(props);
    getUsers();
    const current_posts = getPosts();
    this.state = {
      user: "mada",
      posts: current_posts,
      praised_user: "mada",
      favorites: "",
      postdisabled: true,
      fav_disabled: false,
    };
  }

  async componentDidMount() {
    const users = await getUsers();
    const current_favorites = getFavorites();
    let result = this.checkFavorites(current_favorites, users[0]);
    this.setState({
      user: users[0],
      praised_user: users[0],
      disabled: result,
    });
  }

  changeUser(user_id) {
    const Users = getUsers();
    //配列から添え字の番号のユーザーを取得する。
    const current_favorites = getFavorites();
    const arrNum = user_id - 1;
    let result = this.checkFavorites(current_favorites, Users[arrNum]);
    this.setState({
      user: Users[arrNum],
      fav_disabled: result,
    });
  }

  setPraisedUser(user) {
    if (this.state.user !== user) {
      this.setState({
        praised_user: user,
      });
    }
  }

  checkText(e) {
    if (
      e.target.value.length >= 5 &&
      this.state.user !== this.state.praised_user
    ) {
      this.setState({
        postdisabled: false,
      });
    } else {
      this.setState({
        postdisabled: true,
      });
    }
  }

  addPost(e) {
    e.preventDefault();
    const postElement = e.target.elements["post"];
    const current_posts = getPosts();
    const DateTime = getDate();

    const post = {
      id: current_posts.length + 1,
      praised_user: this.state.praised_user,
      post_user: this.state.user,
      text: postElement.value,
      favorited: 0,
      date: DateTime,
    };
    if (this.state.praised_user !== this.state.user) {
      this.createPost(post, current_posts);
      postElement.value = "";
    }
  }

  createPost(post, current_posts) {
    current_posts.push(post);
    setData(Post, current_posts);
    this.setState({
      posts: current_posts,
      postdisabled: true,
    });
  }

  createFavorite(post) {
    const current_favorites = getFavorites();
    if (this.state.user.iine >= 2) {
      const favorite = {
        id: current_favorites.length + 1,
        post: post,
        user: this.state.user,
      };
      current_favorites.push(favorite);
      setData(Favorite, current_favorites);
      const current_user = this.changeFavoriteCount(post, this.state.user);
      console.log(this);
      let reslut = this.checkFavorites(current_favorites, current_user);
      this.setState({
        user: current_user,
        fav_disabled: reslut,
      });
    }
  }

  changeFavoriteCount(post, current_user) {
    const current_users = getUsers();
    current_users.map((user) => {
      if (
        user.name === post.post_user.name ||
        user.name === post.praised_user.name
      ) {
        user.receive_iine += 1;
      }
    });
    current_users.map((user) => {
      if (user.name === current_user.name) {
        user.iine -= 2;
      }
    });
    current_user.iine -= 2;
    setData(User, current_users);
    return current_user;
  }

  checkFavorites(favorites, user) {
    const current_user_favorites = favorites.filter(
      (favorite) => favorite.user.name === user.name
    );
    if (current_user_favorites.length >= 15) {
      this.changeFavDisabled();
      return true;
    } else {
      return false;
    }
  }

  changeFavDisabled() {
    this.setState({
      fav_disabled: true,
    });
  }

  render() {
    return (
      <React.Fragment>
        <Header
          user={this.state.user}
          changeUser={(user_id) => this.changeUser(user_id)}
        />
        <PostForm
          user={this.state.user}
          text=""
          posts={this.state.posts}
          addPost={(e) => this.addPost(e)}
          setPraisedUser={(user) => this.setPraisedUser(user)}
          praised_user={this.state.praised_user}
          onChange={(e) => this.checkText(e)}
          disabled={this.state.postdisabled}
        />
        <PostList
          user={this.state.user}
          posts={getPosts()}
          onClick={(post) => this.createFavorite(post)}
          favorite={getFavorites()}
          disabled={this.state.fav_disabled}
        />
      </React.Fragment>
    );
  }
}

class Header extends React.Component {
  setDropDown() {
    const users = getUsers();
    return users.map((user) => (
      <Dropdown.Item
        key={user.user_id}
        onClick={() => this.props.changeUser(user.user_id)}
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
            <div>
              <img
                src={`${process.env.PUBLIC_URL}/${this.props.user.image}`}
                alt="Icon"
              />
            </div>
            <div>
              <p>{this.props.user.name}</p>
              <p>いいねできる数:{this.props.user.iine}</p>
              <p>いいねされた数:{this.props.user.receive_iine}</p>
            </div>
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
    const users = getUsers();
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
            placeholder="日頃の感謝を伝えよう!"
            defaultValue={this.props.text}
            onChange={(e) => this.props.onChange(e)}
          />
          <button type="submit" disabled={this.props.disabled}>
            感謝を拡散する
          </button>
        </form>
      </div>
    );
  }
}

class PostList extends React.Component {
  getThePostFavorite(post) {
    const favorites = getFavorites();
    const relationFavorites = favorites.filter(
      (favorite) => favorite.post.id === post.id
    );
    return relationFavorites.length;
  }

  setPostList() {
    const posts = getPosts();
    return posts.map((post, index) => {
      return (
        <ListGroup.Item
          key={index}
          variant="info"
          className="listItem clearfix"
        >
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
          <div className="textArea">
            <div className="text">
              <p>{post.text}</p>
            </div>
            <div className="sub">
              <button
                onClick={() => this.props.onClick(post)}
                disabled={
                  this.props.disabled ||
                  post.post_user.name === this.props.user.name ||
                  post.praised_user.name === this.props.user.name
                }
              >
                拍手をする
              </button>
              <span className="xxx">
                {this.getThePostFavorite(post)}個のいいね
              </span>
              <span className="favs_box">{this.setFavoriteCount(post)}</span>
              <span>投稿日時：{post.date}</span>
            </div>
          </div>
        </ListGroup.Item>
      );
    });
  }

  setFavoriteCount(post) {
    const arr = this.filterUserFav(post);
    return (
      <React.Fragment>
        <p>拍手相手一覧</p>
        <ul>
          {arr.map((user_fav, i) => {
            return (
              <li key={i}>
                user{i + 1}: {user_fav.length}
              </li>
            );
          })}
        </ul>
      </React.Fragment>
    );
  }

  filterUserFav(post) {
    const current_favorites = getFavorites();
    const current_users = getUsers();
    const list_favorites = current_favorites.filter(
      (favorite) => favorite.post.id === post.id
    );

    let arr = [];
    current_users.map((user) => {
      const list = list_favorites.filter((fav) => user.name === fav.user.name);
      arr.push(list);
    });

    return arr;
  }

  render() {
    return (
      <div className="postList" id="content">
        {this.setPostList()}
      </div>
    );
  }
}

export default App;
