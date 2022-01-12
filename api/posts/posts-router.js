// implement your posts router here
const express = require("express");
const Posts = require("./posts-model");
const router = express.Router();

router.get("/", (req, res) => {
  Posts.find(req.query)
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "The posts information could not be retrieved" });
    });
});

router.get("/:id", (req, res) => {
  Posts.findById(req.params.id)
    .then((post) => {
      if (!post) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist" });
      } else {
        res.status(200).json(post);
      }
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "The post information could not be retrieved" });
    });
});

router.post("/", (req, res) => {
  const { title, contents } = req.body;
  Posts.insert(req.body)
    .then(({id}) => {
        return Posts.findById(id)
    })
    .then((post) => {
      res.status(201).json(post);
    })
    .catch((err) => {
      if (!title || !contents) {
        res
          .status(400)
          .json({ message: "Please provide title and contents for the post" });
      } else {
        res
          .status(500)
          .json({
            message: "There was an error while saving the post to the database",
          });
      }
    });
});

// router.put("/:id", (req, res) => {
//   const { id } = req.params.id;
//   const { title, contents } = req.body;
//   if(!title || !contents){
//       res.status(400).json({message:"Please provide title and contents for the post"})
//   } else {
//       Posts.findById(id)
//       .then(post => {
//           if(!post){
//               res.status(404).json({message:"The post with the specified ID does not exist"})
//           }else {
//               return Posts.update(id, req.body)
//           }
//       })
//       .then(post => {
//         if(post) {
//             return Posts.findById(id)
//         }
//       })
//       .then(post => {
//           if(post){
//             res.json(post) 
//           }
//       })
//       .catch(err => {
//         res.status(500).json({message: "The post information could not be modified",
//         })
//       })
//   }
// });

router.put('/:id' ,(req, res)=> {
    const { id } = req.params.id;
    const { title, contents } = req.body;
    if(!id){
        res.status(404).json({message:"The post with the specified ID does not exist"})
    } else if(!title || !contents){
        res.status(400).json({message:"Please provide title and contents for the post"})
    } else {
        Posts.update(id, req.body)
        .then(({id}) => {
             return Posts.findById(id)
        })
        .then((post) => {
          res.status(200).json(post);
        })
        .catch(err => {
            res.status(500).json({message: "The post information could not be modified",
            }) 
    })
}
})

module.exports = router;
