import User from "../models/User.js";

//Read
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {}
};

export const getUserFriends = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    console.log(user);
    const friends = await Promise.all(user.friends.map((friendId) => User.findById(friendId)));
    console.log("Friends", friends);
    const formattedFriends = friends.map(({ _id, firstName, lastName, occupation, location, picturePath }) => {
      return { _id, firstName, lastName, occupation, location, picturePath };
    });
    res.status(200).json(formattedFriends);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user friends", details: error.message });
  }
};

export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);
    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => {
        id !== friendId;
      });
      friend.friends = friend.friends.filter((id) => {
        id !== id;
      });
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();
    res.status(201).json("Friend Updated");
  } catch (error) {
    res.status(500).json({ error: "Failed to edit user friends", details: error.message });
  }
};
