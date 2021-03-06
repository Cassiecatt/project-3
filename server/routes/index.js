const router = require("express").Router();
const path = require('path'); 
const apiRoutes = require("./api");

router.use("/api", apiRoutes);

//return 404
router.use((req, res) => {
  res.status(404).send("<h1>😝 404 Error!</h1>");
});

router.use((req, res) =>
  res.sendFile(path.join(__dirname, "../client/build/index.html"))
);

module.exports = router;
