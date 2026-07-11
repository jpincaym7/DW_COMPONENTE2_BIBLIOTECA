import { ROLES } from '@biblioteca/shared';

import { connectDatabase, disconnectDatabase } from '../config/db.js';
import { env } from '../config/env.js';
import { Author } from '../models/Author.js';
import { Book } from '../models/Book.js';
import { Category } from '../models/Category.js';
import { Loan } from '../models/Loan.js';
import { User } from '../models/User.js';

const CATEGORIES = [
  { name: 'Novela', description: 'Narrativa de ficcion extensa' },
  { name: 'Ciencia Ficcion', description: 'Relatos especulativos y futuristas' },
  { name: 'Historia', description: 'Obras de divulgacion historica' },
  { name: 'Tecnologia', description: 'Programacion, ingenieria y computacion' }
];

const AUTHORS = [
  { name: 'Gabriel Garcia Marquez', nationality: 'Colombiana', birthYear: 1927 },
  { name: 'Isabel Allende', nationality: 'Chilena', birthYear: 1942 },
  { name: 'Frank Herbert', nationality: 'Estadounidense', birthYear: 1920 },
  { name: 'Yuval Noah Harari', nationality: 'Israeli', birthYear: 1976 },
  { name: 'Robert C. Martin', nationality: 'Estadounidense', birthYear: 1952 }
];

const buildBooks = (categoryByName, authorByName) => [
  {
    title: 'Cien anios de soledad',
    isbn: '9780307474728',
    author: authorByName['Gabriel Garcia Marquez'],
    category: categoryByName.Novela,
    publisher: 'Sudamericana',
    publicationYear: 1967,
    description: 'La historia de la familia Buendia en el pueblo de Macondo.',
    totalCopies: 4
  },
  {
    title: 'El amor en los tiempos del colera',
    isbn: '9780307389732',
    author: authorByName['Gabriel Garcia Marquez'],
    category: categoryByName.Novela,
    publisher: 'Oveja Negra',
    publicationYear: 1985,
    description: 'Una historia de amor sostenida durante mas de cinco decadas.',
    totalCopies: 3
  },
  {
    title: 'La casa de los espiritus',
    isbn: '9780553383805',
    author: authorByName['Isabel Allende'],
    category: categoryByName.Novela,
    publisher: 'Plaza y Janes',
    publicationYear: 1982,
    description: 'La saga de la familia Trueba a lo largo de varias generaciones.',
    totalCopies: 2
  },
  {
    title: 'Dune',
    isbn: '9780441013593',
    author: authorByName['Frank Herbert'],
    category: categoryByName['Ciencia Ficcion'],
    publisher: 'Chilton Books',
    publicationYear: 1965,
    description: 'La lucha por el control del planeta desertico Arrakis.',
    totalCopies: 5
  },
  {
    title: 'El mesias de Dune',
    isbn: '9780441172696',
    author: authorByName['Frank Herbert'],
    category: categoryByName['Ciencia Ficcion'],
    publisher: 'Putnam',
    publicationYear: 1969,
    description: 'Continuacion de la saga de Paul Atreides.',
    totalCopies: 2
  },
  {
    title: 'Sapiens: De animales a dioses',
    isbn: '9780062316097',
    author: authorByName['Yuval Noah Harari'],
    category: categoryByName.Historia,
    publisher: 'Debate',
    publicationYear: 2011,
    description: 'Una breve historia de la humanidad.',
    totalCopies: 3
  },
  {
    title: 'Homo Deus',
    isbn: '9780062464347',
    author: authorByName['Yuval Noah Harari'],
    category: categoryByName.Historia,
    publisher: 'Debate',
    publicationYear: 2015,
    description: 'Una breve historia del manana.',
    totalCopies: 2
  },
  {
    title: 'Clean Code',
    isbn: '9780132350884',
    author: authorByName['Robert C. Martin'],
    category: categoryByName.Tecnologia,
    publisher: 'Prentice Hall',
    publicationYear: 2008,
    description: 'Manual de buenas practicas para escribir codigo limpio.',
    totalCopies: 6
  },
  {
    title: 'Clean Architecture',
    isbn: '9780134494166',
    author: authorByName['Robert C. Martin'],
    category: categoryByName.Tecnologia,
    publisher: 'Prentice Hall',
    publicationYear: 2017,
    description: 'Principios de diseno y arquitectura de software.',
    totalCopies: 4
  },
  {
    title: 'The Clean Coder',
    isbn: '9780137081073',
    author: authorByName['Robert C. Martin'],
    category: categoryByName.Tecnologia,
    publisher: 'Prentice Hall',
    publicationYear: 2011,
    description: 'Codigo de conducta para programadores profesionales.',
    totalCopies: 1
  }
];

const buildCoverUrl = (isbn) => `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false`;

const toMapByName = (documents) =>
  documents.reduce((accumulator, document) => {
    accumulator[document.name] = document._id;
    return accumulator;
  }, {});

const clearDatabase = async () => {
  await Promise.all([
    Loan.deleteMany({}),
    Book.deleteMany({}),
    Author.deleteMany({}),
    Category.deleteMany({}),
    User.deleteMany({})
  ]);
};

const createUsers = () =>
  User.create([
    {
      name: 'Administrador General',
      email: env.seedAdminEmail,
      password: env.seedAdminPassword,
      role: ROLES.ADMIN
    },
    {
      name: 'Usuario Demostracion',
      email: env.seedUserEmail,
      password: env.seedUserPassword,
      role: ROLES.USER
    }
  ]);

const runSeed = async () => {
  await connectDatabase();

  await clearDatabase();

  const [categories, authors] = await Promise.all([
    Category.insertMany(CATEGORIES),
    Author.insertMany(AUTHORS)
  ]);

  const books = buildBooks(toMapByName(categories), toMapByName(authors));

  await Book.insertMany(
    books.map((book) => ({
      ...book,
      availableCopies: book.totalCopies,
      coverUrl: buildCoverUrl(book.isbn)
    }))
  );
  await createUsers();

  process.stdout.write('Datos iniciales cargados correctamente\n');
  process.stdout.write(`Administrador: ${env.seedAdminEmail} / ${env.seedAdminPassword}\n`);
  process.stdout.write(`Usuario: ${env.seedUserEmail} / ${env.seedUserPassword}\n`);

  await disconnectDatabase();
};

runSeed().catch(async (error) => {
  process.stderr.write(`Error al cargar los datos iniciales: ${error.message}\n`);
  await disconnectDatabase();
  process.exit(1);
});
