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
    return res.status(200).json({ status: true, data: result.hits.hits });
  } catch (err) {
    console.log("Error" + err);
    client.close();
  } finally {
    client.close();
  }
});

const insertTodo = asyncHandler(async (req, res) => {
  console.log("inside insert todo");
  const { title, description, userId, date } = req.body;

  try {
    if (!title || !description || !userId || !date) {
      return res
        .status(406)
        .json({ status: false, message: "Data incomplete" });
    }
    const client = await configureElasticSearch();
    // check if
    const insertResult = await client.index({
      index: "todo",
      body: {
        title: title,
        description: description,
        status: "false",
        userId: userId,
        date: date,
        isFavourite: false,
      },
    });
    const { _id } = insertResult;
    await client.close();
    return res
      .status(200)
      .json({
        status: true,
        data: { id: _id },
        message: "Insert todo success",
      });
  } catch (err) {
    res.status(500).json({ status: false, message: "Internal server error" });
    console.log("Error in inserting data " + err);
  }
});

export { getTodoById, insertTodo };
