const express = require("express");
const morgan = require("morgan");
const app = express();

morgan.token("postData", (request) => JSON.stringify(request.body));

app.use(express.json());
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :postData"
  )
);
app.use(express.static("dist"));

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  const total = persons.length;
  const date = String(new Date());
  response.send(`<p>Phonebook has info for ${total} people</p><p>${date}</p>`);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const generateId = () => {
  const string = "abcdefg";
  let id = "";
  for (let i = 0; i < 2; i++) {
    id += string.at(Math.floor(Math.random() * string.length));
    id += Math.floor(Math.random() * 99);
  }

  return id;
};

const duplicateName = (name) =>
  persons.map((person) => person.name).includes(name) ? true : false;

app.post("/api/persons", (request, response) => {
  const person = request.body;

  if (!person.name) {
    return response.status(400).json({
      error: "name cannot be empty",
    });
  }
  if (!person.number) {
    return response.status(400).json({
      error: "number cannot be empty",
    });
  }
  if (duplicateName(person.name)) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  person.id = generateId();
  persons = persons.concat(person);
  response.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`server started on ${PORT}`);
});
