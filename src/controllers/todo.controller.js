import configureElasticSearch from "../config/elasticSearch-config.js";
import asyncHandler from "../utils/asyncHandler.js";

const getTodoById = asyncHandler(async (req, res) => {
  // steps to follow
  // check weather id exsits or not
  // if not return there is no user present
  // if id exists then retrieve the todos and send response
  const id = req.params.id;
  console.log(id);
  if (!id) {
    return res
      .status(400)
      .json({ status: false, message: `user with id ${id} does not exist ` });
  }

  const client = await configureElasticSearch();
  try {
    //
    const result = await client.search({
      index: "todo",
      query: {
        match: {
          id: id,
        },
      },
    });
    console.log(result.hits.hits);
    return res.status(200).json({ status: true, message: result.hits.hits });
  } catch (err) {
    console.log("Error" + err);
    client.close();
  } finally {
    client.close();
  }
});

export { getTodoById };
