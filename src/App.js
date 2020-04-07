import React from "react";
import "./App.scss";
import { Dropdown, ListGroup } from "react-bootstrap";

const User = "users";
const Post = "posts";
const Favorite = "favorites";

//初期のユーザーのデータ
const usersList = [
  {
    id: 1,
    name: "ピカチュウ",
    iine: 100,
    receive_iine: 0,
    image: "images/pikachu.jpeg",
  },
  {
    id: 2,
    name: "ブラッキー",
    iine: 100,
    receive_iine: 0,
    image: "images/burakki-.gif",
  },
  {
    id: 3,
    name: "コイキング",
    iine: 100,
    receive_iine: 0,
    image: "images/koikingu.gif",
  },
  {
    id: 4,
    name: "メタモン",
    iine: 100,
    receive_iine: 0,
    image: "images/metamon.gif",
  },
  {
    id: 5,
    name: "ルカリオ",
    iine: 100,
    receive_iine: 0,
    image: "images/rukario.gif",
  },
  {
    id: 6,
    name: "エーフィー",
    iine: 100,
    receive_iine: 0,
    image: "images/e-fi-.jpeg",
  },
  {
    id: 7,
    name: "フライゴン",
    iine: 100,
    receive_iine: 0,
    image: "images/furaigon.jpeg",
  },
  {
    id: 8,
    name: "ギャラドス",
    iine: 100,
    receive_iine: 0,
    image: "images/gyaradosu.jpeg",
  },
  {
    id: 9,
    name: 'アブソル',
    iine: 100,
    receive_iine: 0,
    image: "images/abusoru.gif",
  },
];

//DBからユーザー情報の取得
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

//DBから投稿の情報取得
function getPosts() {
  const Posts = localStorage.getItem(Post);
  const current_posts = Posts ? JSON.parse(Posts) : [];
  return current_posts;
}

//DBから拍手の情報取得
function getFavorites() {
  const Favorites = localStorage.getItem(Favorite);
  const current_favorites = Favorites ? JSON.parse(Favorites) : [];
  return current_favorites;
}

//日時の取得
function getDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const hours = today.getHours();
  const minutes = today.getMinutes();
  const datetime =
    year + "年" + month + "月" + day + "日" + hours + "時" + minutes + "分";
  return datetime;
}

//引数のデータをDBに登録
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

  changeUser(id) {
    const Users = getUsers();
    //配列から添え字の番号のユーザーを取得する。
    const current_favorites = getFavorites();
    const arrNum = id - 1;
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

  //textの数を確認
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

  //投稿をする前の確認
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
    if (this.state.praised_user.id !== this.state.user.id) {
      this.createPost(post, current_posts);
      postElement.value = "";
    }
  }

  //投稿を作成
  createPost(post, current_posts) {
    current_posts.push(post);
    setData(Post, current_posts);
    this.setState({
      posts: current_posts,
      postdisabled: true,
    });
  }

  //拍手を作成
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
      let reslut = this.checkFavorites(current_favorites, current_user);
      this.setState({
        user: current_user,
        fav_disabled: reslut,
      });
    }
  }

  //お気に入りの数の管理
  changeFavoriteCount(post, current_user) {
    const current_users = getUsers();
    current_users.map((user) => {
      if (user.id === post.post_user.id || user.id === post.praised_user.id) {
        user.receive_iine += 1;
      }
    });
    current_users.map((user) => {
      if (user.id === current_user.id) {
        user.iine -= 2;
      }
    });
    current_user.iine -= 2;
    setData(User, current_users);
    return current_user;
  }

  checkFavorites(favorites, user) {
    const current_user_favorites = favorites.filter(
      (favorite) => favorite.user.id === user.id
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
          changeUser={(id) => this.changeUser(id)}
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
        key={user.id}
        onClick={() => this.props.changeUser(user.id)}
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
  //投稿に紐付いたお気に入りの取得
  getThePostFavorite(post) {
    const favorites = getFavorites();
    const relationFavorites = favorites.filter(
      (favorite) => favorite.post.id === post.id
    );
    return relationFavorites.length;
  }

  setPostList() {
    const posts = getPosts().reverse();
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
                {this.getThePostFavorite(post)}個の拍手
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
    const post_favs = this.filterUserFav(post);
    return (
      <React.Fragment>
        <p>拍手相手一覧</p>
        <ul>
          {post_favs.map((user_favs, i) => {
            const listItem = user_favs[i] ? (
              <li key={i}>
                {user_favs[i].user.name}: {user_favs.length}
              </li>
            ) : null;
            return listItem;
          })}
        </ul>
      </React.Fragment>
    );
  }

  //どのユーザーがどれだけ拍手をしたかをするための準備
  filterUserFav(post) {
    const current_favorites = getFavorites();
    const current_users = getUsers();
    let post_favs = [];

    current_users
      .filter(
        (user) =>
          post.post_user.id !== user.id && post.praised_user.id !== user.id
      )
      .map((user) => {
        const list = current_favorites
          .filter((fav) => fav.post.id === post.id)
          .filter((fav) => user.id === fav.user.id);
        post_favs.push(list);
      });
    return post_favs;
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
