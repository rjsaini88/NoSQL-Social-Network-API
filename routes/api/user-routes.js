const router = require("express").Router();
const { User, Thought } = require("../../models");

//TODO - ROUTE THAT GETS ALL THE USERS, include friends?
router.get("/", (req, res) => {
  User.find()
    .populate("thoughts")
    .populate("friends")
    .then((user) => res.json(user))
    .catch((err) => res.status(500).json(err));
});

//TODO - ROUTE THAT CREATES A NEW USER
router.post("/", (req, res) => {
  User.create(req.body)
    .then((newUser) =>
      !newUser
        ? res.status(404).json({ message: "User was not created!" })
        : res.json(newUser)
    )
    .catch((err) => res.status(500).json(err));
});

//TODO - ROUTE THAT GETS A SINGLE USER BASED ON USER ID
router.get("/:userId", (req, res) => {
  User.findOne({ _id: req.params.userId })
    .then((user) =>
      !user
        ? res.status(404).json({ message: "No user found with that id!" })
        : res.json(user)
    )
    .catch((err) => res.status(500).json(err));
});

//TODO - ROUTE THAT UPDATES A SINGLE USER
router.put("/:userId", (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.params.userId },
    { $set: req.body },
    { runValidators: true, new: true }
  )
    .then((user) =>
      !user
        ? res.status(404).json({ message: "No user found with this id!" })
        : res.json(user)
    )
    .catch((err) => res.status(500).json(err));
});

//TODO - ROUTE THAT DELETES A SINGLE USER BASED ON USER ID
router.delete("/:userId", (req, res) => {
  User.findOneAndDelete({ _id: req.params.userId })
    .then((user) =>
      !user
        ? res.status(404).json({ message: "No user found with that ID" })
        : Thought.deleteMany({ _id: { $in: user.thoughts } })
    )
    .then(() => res.json({ message: "User and associated thoughts deleted!" }))
    .catch((err) => res.status(500).json(err));
});

//TODO - ROUTE THAT ADDS A FRIEND TO A USER //
router.post("/:userId/friends/:friendId", (req, res) => {
  User.findOneAndUpdate(
    { _id: req.params.userId },
    { $addToSet: { friends: req.params.friendId } },
    { runValidators: true, new: true }
  )
    .then((user) =>
      !user
        ? res.status(404).json({ message: "No user found with this id!" })
        : res.json(user)
    )
    .catch((err) => res.status(500).json(err));
});

//TODO - ROUTE THAT DELETES A FRIEND FROM A USER'S FRIENDS, DONT DELETE THE FRIEND AS A USER THOUGH!
router.delete("/:userId/friends/:friendId", (req, res) => {
  User.findOneAndUpdate(
    { _id: req.params.userId },
    { $pull: { friends: req.params.friendId } },
    { runValidators: true, new: true }
  )
    .then((user) =>
      !user
        ? res.status(404).json({ message: "No user found with that ID :(" })
        : res.json("This person has been removed from your firend's list")
    )
    .catch((err) => res.status(500).json(err));
});

module.exports = router;
