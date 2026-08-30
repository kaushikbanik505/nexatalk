import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";
import { upsertStreamUser } from "../lib/stream.js";

export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user.id;
    const currentUser = req.user;

    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } }, //exclude current user
        { _id: { $nin: currentUser.friends } }, // exclude current user's friends
        { _id: { $nin: currentUser.blockedUsers } }, // exclude people this user blocked
        { blockedUsers: { $ne: currentUserId } }, // exclude people who blocked this user
        { isOnboarded: true },
      ],
    });
    res.status(200).json(recommendedUsers);
  } catch (error) {
    console.error("Error in getRecommendedUsers controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMyFriends(req, res) {
  try {
    const user = await User.findById(req.user.id)
      .select("friends")
      .populate("friends", "fullName profilePic nativeLanguage learningLanguage lastActiveAt");

    res.status(200).json(user.friends);
  } catch (error) {
    console.error("Error in getMyFriends controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function unfriendUser(req, res) {
  try {
    const myId = req.user.id;
    const { id: friendId } = req.params;

    await User.findByIdAndUpdate(myId, { $pull: { friends: friendId } });
    await User.findByIdAndUpdate(friendId, { $pull: { friends: myId } });

    res.status(200).json({ message: "Friend removed" });
  } catch (error) {
    console.error("Error in unfriendUser controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function blockUser(req, res) {
  try {
    const myId = req.user.id;
    const { id: targetId } = req.params;

    if (myId === targetId) {
      return res.status(400).json({ message: "You can't block yourself" });
    }

    await User.findByIdAndUpdate(myId, {
      $addToSet: { blockedUsers: targetId },
      $pull: { friends: targetId },
    });
    await User.findByIdAndUpdate(targetId, { $pull: { friends: myId } });

    // A block supersedes any pending/accepted friend-request history between the two -
    // otherwise an old accepted request would keep them looking "friends" in odd corners.
    await FriendRequest.deleteMany({
      $or: [
        { sender: myId, recipient: targetId },
        { sender: targetId, recipient: myId },
      ],
    });

    res.status(200).json({ message: "User blocked" });
  } catch (error) {
    console.error("Error in blockUser controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function unblockUser(req, res) {
  try {
    const myId = req.user.id;
    const { id: targetId } = req.params;

    await User.findByIdAndUpdate(myId, { $pull: { blockedUsers: targetId } });

    res.status(200).json({ message: "User unblocked" });
  } catch (error) {
    console.error("Error in unblockUser controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getBlockedUsers(req, res) {
  try {
    const user = await User.findById(req.user.id)
      .select("blockedUsers")
      .populate("blockedUsers", "fullName profilePic");

    res.status(200).json(user.blockedUsers);
  } catch (error) {
    console.error("Error in getBlockedUsers controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function sendFriendRequest(req, res) {
  try {
    const myId = req.user.id;
    const { id: recipientId } = req.params;

    // prevent sending req to yourself
    if (myId === recipientId) {
      return res.status(400).json({ message: "You can't send friend request to yourself" });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    // check if user is already friends
    if (recipient.friends.includes(myId)) {
      return res.status(400).json({ message: "You are already friends with this user" });
    }

    // blocking is mutual - blocks either direction stop a new request
    if (recipient.blockedUsers.includes(myId) || req.user.blockedUsers.includes(recipientId)) {
      return res.status(403).json({ message: "You can't send a friend request to this user" });
    }

    // check if a req already exists
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "A friend request already exists between you and this user" });
    }

    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    });

    res.status(201).json(friendRequest);
  } catch (error) {
    console.error("Error in sendFriendRequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function acceptFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params;

    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    // Verify the current user is the recipient
    if (friendRequest.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to accept this request" });
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    // add each user to the other's friends array
    // $addToSet: adds elements to an array only if they do not already exist.
    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });

    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.log("Error in acceptFriendRequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getFriendRequests(req, res) {
  try {
    const incomingReqs = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending",
    }).populate("sender", "fullName profilePic nativeLanguage learningLanguage");

    const acceptedReqs = await FriendRequest.find({
      sender: req.user.id,
      status: "accepted",
    }).populate("recipient", "fullName profilePic");

    // sender/recipient can be null if that user was deleted after the request was created
    res.status(200).json({
      incomingReqs: incomingReqs.filter((r) => r.sender),
      acceptedReqs: acceptedReqs.filter((r) => r.recipient),
    });
  } catch (error) {
    console.log("Error in getPendingFriendRequests controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function updateProfile(req, res) {
  try {
    const userId = req.user.id;
    const { fullName, bio, phone, links, location, profilePic } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fullName, bio, phone, links, location, profilePic },
      { new: true, runValidators: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    await upsertStreamUser({
      id: updatedUser._id.toString(),
      name: updatedUser.fullName,
      image: updatedUser.profilePic || "",
    });

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error in updateProfile controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getOutgoingFriendReqs(req, res) {
  try {
    const outgoingRequests = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");

    // recipient can be null if that user was deleted after the request was created
    res.status(200).json(outgoingRequests.filter((r) => r.recipient));
  } catch (error) {
    console.log("Error in getOutgoingFriendReqs controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}