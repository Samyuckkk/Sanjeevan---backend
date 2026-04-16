const sanitizeUser = (userDocument) => {
  const user = userDocument.toObject ? userDocument.toObject() : userDocument;
  const { passwordHash, _id, createdAt, updatedAt, ...rest } = user;

  return {
    id: String(_id),
    ...rest,
    createdAt,
    updatedAt,
  };
};

module.exports = { sanitizeUser };
