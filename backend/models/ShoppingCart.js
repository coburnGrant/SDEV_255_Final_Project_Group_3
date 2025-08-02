const db = require("../db");

const cartItemSchema = new db.Schema({
    courseId: {
        type: db.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    addedAt: {
        type: Date,
        default: Date.now
    }
});

const shoppingCartSchema = new db.Schema({
    userId: {
        type: db.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    items: [cartItemSchema]
}, {
    timestamps: true
});

// Virtual for cart item count
shoppingCartSchema.virtual('itemCount').get(function() {
    return this.items.length;
});

// Method to add course to cart
shoppingCartSchema.methods.addCourse = function(courseId) {
    // Check if course is already in cart
    const existingItem = this.items.find(item => 
        item.courseId.toString() === courseId.toString()
    );
    
    if (!existingItem) {
        this.items.push({ courseId });
        this.updatedAt = new Date();
        return true; // Course added
    }
    return false; // Course already exists
};

// Method to remove course from cart
shoppingCartSchema.methods.removeCourse = function(courseId) {
    const initialLength = this.items.length;
    this.items = this.items.filter(item => 
        item.courseId.toString() !== courseId.toString()
    );
    
    if (this.items.length !== initialLength) {
        this.updatedAt = new Date();
        return true; // Course removed
    }
    return false; // Course not found
};

// Method to clear cart
shoppingCartSchema.methods.clearCart = function() {
    this.items = [];
    this.updatedAt = new Date();
};

// Method to check if course is in cart
shoppingCartSchema.methods.hasCourse = function(courseId) {
    return this.items.some(item => 
        item.courseId.toString() === courseId.toString()
    );
};

const ShoppingCart = db.model("ShoppingCart", shoppingCartSchema);

module.exports = ShoppingCart; 