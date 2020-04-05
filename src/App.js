import React from "react";
import "./App.css";

const User = "users";
const users = [
  { user_id: 1, name: "Iwashita", iine: 100 },
  { user_id: 2, name: "Kawasaki", iine: 100 },
  { user_id: 3, name: "Baba", iine: 100 },
  { user_id: 4, name: "Honda", iine: 100 },
  { user_id: 5, name: "Fujikawa", iine: 100 },
];
localStorage.setItem(User, JSON.stringify(users));


class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: users[0]
    }
  }

  change_user() {
    this.setState({
      user: users[1]
    })
  }

  render() {
    return (
      <React.Fragment>
        <Header user={this.state.user} change_user={() => this.change_user()} />
        <Post user={this.state.user} />
        <PostList user={this.state.user} />
      </React.Fragment>
    );
  } 
}

class Header extends React.Component {
  constructor(props) {
    super(props);
    set_user(this)
  }

  render() {
    console.log(this.state.user)
    return(
      <header>
        <button onClick={this.props.change_user}>
          kkkkkkkkkkkkkkkk
        </button>
      </header>
    )
  } 
}

class Post extends React.Component {
  constructor(props) {
    super(props);
    set_user(this)
    console.log(this.state.user)
  }
  render() {
    return(
      <div>
        <button onClick={() => console.log(this.state.user)}>
          kkkkkkk
        </button>
      </div>
    )
  } 
}

class PostList extends React.Component {
  constructor(props) {
    super(props);
    set_user(this)
    console.log(this.state.user)
  }
  render() {
    return (
      <PostItem user={this.state.user}/>
    );
  } 
}

class PostItem extends React.Component {
  constructor(props) {
    super(props);
    set_user(this)
  }
  render() {
    console.log(this.state.user)
    return (
      <div></div>
    )
  }
}

function set_user(x) {
  x.state = {
    user: x.props.user
  }
}

export default App;
