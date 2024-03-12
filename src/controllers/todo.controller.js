import { connectDB, releaseConnection } from "../config/db.js";
import configureElasticSearch from "../config/elasticSearch-config.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Sequelize, DataTypes } from "sequelize";

const getTodoWithId = asyncHandler(async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res
        .status(400)
        .json({ status: false, message: `user with id ${id} does not exist ` });
    }
    const connection = await connectDB();
    const query = `SELECT * FROM todo where userId=${id}`;
    const result = await connection.query(query);
    if (result.rows && result.rows.length > 0) {
      return res.status(200).json({ status: true, data: result.rows });
    } else {
      return res.status(404).json({ message: "todo not found" });
    }
  } catch (err) {
    console.log("Error" + err);
  }
});

const insertTodo = asyncHandler(async (req, res) => {
  const { title, description, userId, date } = req.body;

  try {
    if (!title || !description || !userId || !date) {
      return res
        .status(406)
        .json({ status: false, message: "Data incomplete" });
    }

    const connection = await connectDB();
    const checkIfRecordExistQuery = `SELECT * FROM todo WHERE userId=${userId} AND title='${title}'`;
    const doesRecordExist = await connection.query(checkIfRecordExistQuery);
    if (doesRecordExist.rows.length > 0) {
      return res.status(403).json({
        data: "Record Already Exists",
      });
    }
    // check if
    const insertQuery = `INSERT INTO todo (title,description,status,userId,date,isfavourite) VALUES ('${title}','${description}','incomplete','${userId}','${date}','false')`;
    const insertRecord = await connection.query(insertQuery);
    await releaseConnection(connection);
    if (insertRecord.rowCount >= 1) {
      return res.status(200).json({
        status: true,
        data: { insertRecord },
        message: "Insert todo success",
      });
    }
  } catch (err) {
    res.status(500).json({ status: false, message: "Internal server error" });
    console.log("Error in inserting data " + err);
  }
});

const deleteTodo = asyncHandler(async (req, res, next) => {
  console.log("here");
  console.log(userId, todoId);
  const { userId, todoId } = req.body;
  if (!userId || !todoId) {
    return res.status(404).json({ message: "Payload Data Not available" });
  }
  // check if todo exists
  const checkIfTodoExistsQuery = `SELECT * FROM todo WHERE id='${todoId}' AND userid='${userId}'`;
  const connection = await connectDB();
  const result = await connection.query(checkIfTodoExistsQuery);
  if (result.rows.length === 0) {
    return res.status(404).json({ message: "Todo Does not exist" });
  }
  // todo exist delete here
  const deleteQuery = `DELETE FROM todo WHERE id='${todoId}' AND userid='${userId}'`;
  const isDeleted = await connection.query(deleteQuery);
  await releaseConnection(connection);
  if (isDeleted.rowCount >= 1) {
    return res.status(200).json({ message: "Todo Sucessfully Deleted" });
  } else {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

const updateTodoStatus = asyncHandler(async (req, res, next) => {
  const { option, todoId } = req.body;
  if (!option || !todoId) {
    return res.status(404).json({ "messahe ": "Invalid data" });
  }
  const connection = await connectDB();
  const searchQuery = `SELECT * FROM todo WHERE id=${todoId}`;
  const doesTodoExist = await connection.query(searchQuery);
  if (doesTodoExist.rows.length === 0) {
    return res.status(404).json({ "messahe ": "Invalid data" });
  }
  const updateQuery = `UPDATE todo SET status='${option}' WHERE id=${todoId}`;
  const result = await connection.query(updateQuery);
  if (result.rowCount >= 1) {
    return res.status(200).json({ message: "Todo Sucessfully Deleted" });
  } else {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export { getTodoWithId, insertTodo, deleteTodo, updateTodoStatus };
