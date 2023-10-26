import { AiOutlineFileImage } from "react-icons/ai";
import { BsPersonPlus } from "react-icons/bs";
import { GrMoney } from "react-icons/gr";
import { BiMoneyWithdraw } from "react-icons/bi";
import { useState } from "react";
// Added build for hosting

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

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);
  function handleIsOpen() {
    setIsAddFormOpen(!isAddFormOpen);
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setIsAddFormOpen(false);
  }

  function handleSelection(friend) {
    // setSelectedFriend(friend);
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setIsAddFormOpen(false);
  }

  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );

    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelection={handleSelection}
          selectedFriend={selectedFriend}
        />

        {isAddFormOpen && <AddFriendForm onAddFriend={handleAddFriend} />}

        <Button onClick={handleIsOpen}>{`${
          isAddFormOpen ? "Close" : "Add friend"
        }`}</Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, onSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;

  return (
    <li className={`${isSelected ? "selected" : ""}`}>
      <img src={friend.image} alt={friend.name}></img>
      <h3>{friend.name}</h3>
      <p
        className={`${
          friend.balance < 0 ? "red" : friend.balance > 0 ? "green" : ""
        }`}
      >
        {friend.balance < 0 && `You owe ${friend.name} ${-1 * friend.balance}$`}
        {friend.balance > 0 && `${friend.name} owes you ${friend.balance}$`}
        {friend.balance === 0 && `You and ${friend.name} are even`}
      </p>
      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "Cancel" : "Select"}
      </Button>
    </li>
  );
}

function AddFriendForm({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();
    const newFriend = { name, image, id, balance: 0 };

    onAddFriend(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label className="icon">
        <BsPersonPlus /> Friend name:
      </label>
      <input
        type="text"
        placeholder="Enter friend's name..."
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label className="icon">
        <AiOutlineFileImage /> Image URL
      </label>
      <input
        type="text"
        placeholder="Enter friend's image..."
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [userExpenese, setUserExpense] = useState("");
  const [whoIsPaying, setWhoIsPaying] = useState("user");
  const paidByFriend = bill ? bill - userExpenese : "";

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !userExpenese) return;
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -userExpenese);

    setBill("");
    setUserExpense("");
    setWhoIsPaying("");
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split bill with {selectedFriend.name}</h2>

      <label className="icon">
        <GrMoney />
        Bill value
      </label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(+e.target.value)}
      />

      <label className="icon">
        <BiMoneyWithdraw />
        How much was your part?
      </label>
      <input
        type="text"
        value={userExpenese}
        onChange={(e) =>
          setUserExpense(
            +e.target.value > bill ? userExpenese : +e.target.value
          )
        }
      />

      <label className="icon">
        <BiMoneyWithdraw />
        How much was {selectedFriend.name}'s part?
      </label>
      <input type="text" disabled value={paidByFriend} />

      <label className="icon">Who is paying?</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  );
}
