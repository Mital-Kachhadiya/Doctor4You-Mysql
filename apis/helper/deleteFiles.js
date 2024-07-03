const fs = require("fs");

module.exports = deleteFiles = (files) => {
  const basePath = "./public/images/" + files;

  try {
    //Delete multiple files
    if (Array.isArray(files)) {
      files.forEach((path) => {
        // Going through every file and check for existance...
        if (fs.existsSync(basePath)) {
          fs.unlinkSync(basePath);
        }
      });
    } else {
      if (fs.existsSync(basePath)) {
        fs.unlinkSync(basePath);
      }
    }
  } catch (error) {
    console.log(error);
  }
};
