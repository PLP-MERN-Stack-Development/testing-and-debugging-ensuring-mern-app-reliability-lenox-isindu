const User = {
  findOne: jest.fn(() => Promise.resolve(null)),
  findById: jest.fn(() => Promise.resolve(null)),
  findByIdAndUpdate: jest.fn(() => Promise.resolve(null)),
  create: jest.fn(() => Promise.resolve({})),
  
  // Chainable methods
  select: jest.fn(() => ({
    exec: jest.fn(() => Promise.resolve(null))
  })),
  populate: jest.fn(() => ({
    exec: jest.fn(() => Promise.resolve(null))
  })),
};

module.exports = User;