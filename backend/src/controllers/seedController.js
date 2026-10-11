const { runSeed } = require("../seed");

const triggerSeed = async (req, res, next) => {
  try {
    await runSeed();
    return res.status(200).json({
      success: true,
      message: "Database re-seeded successfully with fresh Indian hospital demo data!",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  triggerSeed,
};
