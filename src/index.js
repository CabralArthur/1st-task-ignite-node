const cors = require('cors');
const express = require('express');
const { v4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

const checksExistsUserAccount = (req, res, next) => {
	const { username } = req.headers;

	const user = users.find(user => user.username === username);

	if (!user) {
		return res.json({
			code: 404,
			status: 'error',
			message: 'Invalid User!'
		});
	}

	req.user = user;

	next();
}

app.post('/users', (req, res) => {
	const user = {
		id: v4(),
		name: req.body.name,
		username: req.body.username,
		todo: []
	};

	users.push(user);

	res.json({
		code: 200,
		status: 'success'
	});
});

app.get('/todos', checksExistsUserAccount, (req, res) => {
	return res.json({
    code: 200,
    data: req.user.todos
  });
});

app.post('/todos', checksExistsUserAccount, (req, res) => {
	const todo = {
    id: v4(),
    title: req.body.title,
    done: false,
    deadline: new Date(req.body.deadline),
    created_at: new Date()
  }

  req.user.todos.push(todo)

  return res.json({
    code: 200,
    data: req.user.todos
  });
});

app.put('/todos/:id', checksExistsUserAccount, (req, res) => {
  const changes = {
    title: req.body.title,
    deadline: new Date(req.body.deadline)
  }

  const todo = req.user.todos.find(todo => todo.id = req.params.id);

  if (!todo) {
		return res.json({
			code: 404,
			status: 'error',
			message: 'Data Not Found!'
		});
	}

  todo.title = changes.title;
  todo.deadline = changes.deadline;

  return res.json({
    code: 200,
    data: todo
  });
});

app.patch('/todos/:id/done', checksExistsUserAccount, (req, res) => {
  const todo = req.user.todos.find(todo => todo.id = req.params.id);

  if (!todo) {
		return res.json({
			code: 404,
			status: 'error',
			message: 'Data Not Found!'
		});
	}

  todo.done = !todo.done;

  return res.json({
    code: 200,
    data: todo
  });
});

app.delete('/todos/:id', checksExistsUserAccount, (req, res) => {
	const todo = req.user.todos.find(todo => todo.id = req.params.id);

  if (!todo) {
		return res.json({
			code: 404,
			status: 'error',
			message: 'Data Not Found!'
		});
	}

  req.user.todos.splice(todo, 1);

  return res.json({
    code: 200,
    status: 'success'
  });
});

module.exports = app;