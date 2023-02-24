const router = require("express").Router();
const { Thought, Reaction, User } = require("../../models");

//TODO: ROUTE TO GET ALL THOUGHTS
router.get("/", (req, res) => {
  Thought.find()
    .then((thoughts) => res.json(thoughts))
    .catch((err) => res.status(500).json(err));
}),
  //   Thought.find({}, (err, thoughts) => {
  //     res.status(200).json(thoughts);
  //   });
  // });

  //TODO: ROUTE TO CREATE A NEW THOUGHT
  router.post("/", (req, res) => {
    Thought.create(req.body)
      .then((thought) => {
        return User.findOneAndUpdate(
          { _id: req.body.userId },
          { $addToSet: { thoughts: thought._id } },
          { new: true }
        );
      })
      .then((user) =>
        !user
          ? res.status(404).json({
              message: "Post created, but found no user with that ID",
            })
          : res.json("Create the post")
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  });

//     Thought.create(req.body)
//       .then((thoughts) => res.json(thoughts))
//       .catch((err) => {
//         console.log(err);
//         return res.status(500).json(err);
//       });

//   });

//TODO: ROUTE TO GET SINGLE THOUGHT BASED ON THOUGHT ID
router.get("/:thoughtId", (req, res) => {
  Thought.findOne({ _id: req.params.thoughtId })
    .then((thought) =>
      !thought
        ? res.status(404).json({ message: "No thought found with that id!" })
        : res.json(thought)
    )
    .catch((err) => res.status(500).json(err));
});

//TODO: ROUTE TO UPDATE A THOUGHT
router.put("/:thoughtId", (req, res) => {
  Thought.findByIdAndUpdate(
    { _id: req.params.thoughtId },
    { $set: req.body },
    { runValidators: true, new: true }
  )
    .then((thought) =>
      !thought
        ? res.status(404).json({ message: "No thought found with this id!" })
        : res.json(thought)
    )
    .catch((err) => res.status(500).json(err));
});

//TODO: ROUTE TO DELETE A THOUGHT BASED ON THOUGHT ID
router.delete("/:thoughtId", (req, res) => {
  Thought.findOneAndDelete({ _id: req.params.thoughtId }, (err, thought) => {
    if (thought) {
      res.status(200).json(thought);
      console.log(`Deleted: ${thought}`);
    } else {
      console.log("Something went wrong");
      res.status(500).json({ message: "No thought found with this id!" });
    }
  });
});

// .then ((thought)=>
// !thought ? res.status(404).json({message: "No thought found with this id!"})
// : )
// });

//TODO: ROUTE TO ADD REACTION TO A THOUGHT // create reaction first const reaction. create
// router.post("/:thoughtId/reactions", async (req, res) => {
//   const reaction = await Reaction.create (req.body)
//   try{
//   const reaction = await Reaction.create({})

//   Thought.findOneAndUpdate(
//     { _id: req.params.thoughtId },
//     { $addToSet: { reactions: req.body } },
//     { runValidators: true, new: true }
//   );
//   res.status(200).json("reaction added");
//   }catch(err){console.log(err)

//     return res.status(500).json(err);}
//     .then((thoughts) =>
//       !thoughts
//         ? res.status(404).json({ message: "No thoughts found with this id!" })
//         : res.json("Reaction successfully added to the thought")
//     )
//     .catch((err) => res.status(500).json(err));
// });

router.post("/:thoughtId/reactions", (req, res) => {
  Thought.findOneAndUpdate(
    { _id: req.params.thoughtId },
    { $addToSet: { reactions: req.body } },
    { runValidators: true, new: true }
  )
    .then((thoughts) =>
      !thoughts
        ? res.status(404).json({ message: "No thoughts found with this id!" })
        : res.json(thoughts)
    )
    .catch((err) => res.status(500).json(err));
});

//TODO: ROUTE TO DELETE A REACTION ON A THOUGHT
router.delete("/:thoughtId/reactions/:reactionId", (req, res) => {
  Thought.findOneAndUpdate(
    { _id: req.params.thoughtId },
    { $pull: { reactions: { reactionId: req.params.reactionId } } },
    { runValidators: true, new: true }
  )
    .then((thoughts) =>
      !thoughts
        ? res.status(404).json({ message: "No thought found with that ID :(" })
        : res.json("Reactions has been removed")
    )
    .catch((err) => res.status(500).json(err));
});

module.exports = router;
