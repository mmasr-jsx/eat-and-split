import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  
  function handleOpenAddForm() {
    setIsAddFormOpen((show) => !show);
  }

  function handleAddFriend(newFriend) {
    console.log(friends);
    setFriends((curFriends) => [...curFriends, newFriend]);
    console.log(friends)
  }

  function handleSelectFriend(chosen) {
    setSelectedFriend(chosen);
  }

  function handleSplitBill(value) {
    setFriends((friends) => friends.map(friend => friend.id === selectedFriend.id ? {...friend, balance: friend.balance + value} : friend))
  }
  
  return (<div className="app">
    <div className="sidebar">
      <FriendList selectedFriend={selectedFriend} friends={friends} onSelectFriend={handleSelectFriend}/>
      {isAddFormOpen && <FormAddFriend onAddFriend={handleAddFriend} />}
      <Btn onClick={handleOpenAddForm}>{isAddFormOpen ? "Close" : "Add Friend"}</Btn>

    </div>
    {selectedFriend && <FormSplitBill selectedFriend={selectedFriend} onSplitBill={handleSplitBill} />}
  </div>);
}

function Btn({ children, onClick }) {

  return (<button className="button" onClick={onClick}>{children}</button>);
}

function FriendList({ friends, onSelectFriend, selectedFriend }) {
  
  return (<ul>
    {friends.map(friend => <Friend selectedFriend={selectedFriend} friend={friend} key={friend.id} onSelectFriend={onSelectFriend} />)}
  </ul>);
}

function Friend({friend, onSelectFriend, selectedFriend}) {
  const isSelected = selectedFriend?.id === friend.id;

  return (<li className={isSelected ? "selected" : ""}>
    <img src={friend.image} alt={friend.name} />
    <h3>{friend.name}</h3>
    
    {friend.balance < 0 && (
      <p className="red">We owe this light creature {friend.name} {Math.abs(friend.balance)}€</p>
    )}
    {friend.balance > 0 && (
      <p className="green">This little bitch owe's us {friend.name} {Math.abs(friend.balance)}€</p>
    )}
    {friend.balance === 0 && (
      <p>We don't work with pleasants like {friend.name}</p>
    )}

    <Btn onClick={() => onSelectFriend(friend)}>Select</Btn>
  </li>);
}


function FormAddFriend({onAddFriend}) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if(!name || !image) return;

    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    onAddFriend(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48");
  }
  
  return (<form className="form-add-friend" onSubmit={handleSubmit}>
    <label>👼Friend</label>
    <input type="text" value={name} onChange={(e) => setName((curName) => e.target.value)}/>

    <label>⏹Image URL</label>
    <input type="text" value={image} onChange={(e) => setImage((curImg) => e.target.value)}/>

    <Btn>Add</Btn>
  </form>);
}

function FormSplitBill({selectedFriend, onSplitBill}) {
const [bill, setBill] = useState("");
const [paidByUser, setPaidByUser] = useState("");
const [who, setWho] = useState("");
var paidBySlave = 0;
paidBySlave = paidByUser <= bill ?  (paidBySlave = bill - paidByUser) : 0;

function handleSubmit(e) {
  e.preventDefault();

  if(!bill || !paidByUser || paidByUser > bill) return;

  onSplitBill(who === "user" ? paidByUser : -paidBySlave);
}

return (<form className="form-split-bill" onSubmit={handleSubmit}>
    <h2>Split a bill with {selectedFriend.name}</h2>

    <label>🤬 Bill Value</label>
    <input type="text" value={bill} onChange={(e) => setBill(Number(e.target.value))} />

    <label>🤦‍♀️ Your expense</label>
    <input type="text"  value={paidByUser} onChange={(e) => setPaidByUser(Number(e.target.value))} />

    <label>🤳 {selectedFriend.name} expense</label>
    <input type="text" value={paidBySlave} disabled/>

    <label>🤑 Who's paying the bill?</label>
    <select value={who} onChange={(e) => setWho(e.target.value)}>
      <option value="user">You (Ha!)</option>
      <option value="friend">{selectedFriend.name}</option>
    </select>

    <Btn>Split Bill</Btn>
  </form>);
}



