const Bug = {
  find: jest.fn(() => ({
    populate: jest.fn(() => ({
      sort: jest.fn(() => Promise.resolve([]))
    }))
  })),
  
  findById: jest.fn(() => ({
    populate: jest.fn(() => ({
      populate: jest.fn(() => Promise.resolve(null))
    }))
  })),
  
  findByIdAndUpdate: jest.fn(() => ({
    populate: jest.fn(() => Promise.resolve(null))
  })),
  
  findByIdAndDelete: jest.fn(() => Promise.resolve(null)),
  
  create: jest.fn(() => Promise.resolve({}))
};

module.exports = Bug;