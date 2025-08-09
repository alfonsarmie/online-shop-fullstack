const { Router } = require('express');




const router = Router();



router.get("/", (req, res) => {
  res.send("Lista de usuarios");
});


module.exports = router;



