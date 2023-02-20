const router = require("express").Router();
const { Thought, Reaction } = require("../../models");

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
      .then((thoughts) => res.json(thoughts))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });

    //   Thought.create(
    //     {
    //       thoughtText: req.body.thoughtText,
    //       username: req.body.username,
    //     },
    //     (err, thought) => {
    //       res.status(200).json(true);
    //     }
    //   );
  });

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
      res.status(500).json({ message: "Something went wrong" });
    }
  });
});

// .then ((thought)=>
// !thought ? res.status(404).json({message: "No thought found with this id!"})
// : )
// });

//TODO: ROUTE TO ADD REACTION TO A THOUGHT
router.post("/:thoughtId/reactions", (req, res) => {
  Thought.findByIdAndUpdate(
    { _id: req.params.thoughtId },
    { $addToSet: { reaction: req.body } },
    { runValidators: true, new: true }
  )
    .then((thought) =>
      !thought
        ? res.status(404).json({ message: "No thought found with this id!" })
        : res.json(thought)
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
    .then((thought) =>
      !thought
        ? res.status(404).json({ message: "No thought found with that ID :(" })
        : res.json(thought)
    )
    .catch((err) => res.status(500).json(err));
});

module.exports = router;
