const Workspace = {
  findOne: jest.fn(() => Promise.resolve(null)),
  findById: jest.fn(() => Promise.resolve(null)),
  create: jest.fn(() => Promise.resolve({})),
  findByIdAndUpdate: jest.fn(() => Promise.resolve(null)),
  
  // Static methods
  createWorkspace: jest.fn(() => Promise.resolve({})),
  
  // Chainable methods
  populate: jest.fn(() => ({
    exec: jest.fn(() => Promise.resolve(null))
  })),
};

module.exports = Workspace;