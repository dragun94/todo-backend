const todoValidator = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['title', 'completed', 'createdAt', 'updatedAt'],
    properties: {
      _id: { bsonType: 'objectId' },
      title: { bsonType: 'string', minLength: 1, maxLength: 500, pattern: '\\S' },
      completed: { bsonType: 'bool' },
      createdAt: { bsonType: 'date' },
      updatedAt: { bsonType: 'date' },
    },
  },
};

function createTodoDocument(title) {
  if (typeof title !== 'string' || !title.trim() || title.trim().length > 500) {
    throw new TypeError('할 일은 1~500자의 문자열로 입력해주세요.');
  }
  const now = new Date();
  return { title: title.trim(), completed: false, createdAt: now, updatedAt: now };
}

module.exports = { todoValidator, createTodoDocument };

