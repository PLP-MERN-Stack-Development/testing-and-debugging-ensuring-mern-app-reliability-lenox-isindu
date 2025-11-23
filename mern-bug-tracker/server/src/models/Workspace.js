const mongoose = require('mongoose');

const workspaceSchema = new mongoose.Schema({
   name: {
    type: String,
    required: [true, 'Please add a workspace name'],
    trim: true,
    maxlength: [100, 'Workspace name cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters'],
    default: ''
  },
  category: {
    type: String,
    enum: ['development', 'design', 'marketing', 'operations', 'support', 'other'],
    default: 'development'
  },
  visibility: {
    type: String,
    enum: ['private', 'public'],
    default: 'private'
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['admin', 'member'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

//  workspace creation with code generation
workspaceSchema.statics.createWorkspace = async function(workspaceData) {
  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  let code;
  let isUnique = false;
  let attempts = 0;

  while (!isUnique && attempts < 10) {
    code = generateCode();
    const existing = await this.findOne({ code });
    if (!existing) {
      isUnique = true;
    }
    attempts++;
  }

  if (!isUnique) {
    throw new Error('Could not generate unique workspace code');
  }

  return this.create({
    ...workspaceData,
    code
  });
};

module.exports = mongoose.model('Workspace', workspaceSchema);