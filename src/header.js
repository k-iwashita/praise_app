// import React from "react";
// import "./App.scss";


// export class Header extends React.Component {
//   setDropDown() {
//     const users = get_users();
//     return users.map((user) => (
//       <Dropdown.Item
//         key={user.user_id}
//         onClick={() => this.props.change_user(user.user_id)}
//       >
//         {user.name}
//       </Dropdown.Item>
//     ));
//   }

//   render() {
//     return (
//       <header id="content">
//         <div className="headerContent">
//           <div className="userProfile">
//             <div>
//             <img
//               src={`${process.env.PUBLIC_URL}/${this.props.user.image}`}
//               alt="Icon"
//             />
//             </div>
//             <div>
//               <p>{this.props.user.name}</p>
//               <p>いいねできる数:{this.props.user.iine}</p>
//               <p>いいねされた数:{this.props.user.receive_iine}</p>
//             </div>
//           </div>
//           <Dropdown className="userSelect">
//             <Dropdown.Toggle variant="success" id="dropdown-basic">
//               You Can Select User
//             </Dropdown.Toggle>
//             <Dropdown.Menu>{this.setDropDown()}</Dropdown.Menu>
//           </Dropdown>
//         </div>
//       </header>
//     );
//   }
// }

