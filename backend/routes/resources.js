import express from "express";
import Resource from "../models/Resource.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// @route   GET /api/resources
// @desc    Get all resources with filters + PAGINATION
// @access  Public
router.get("/", async (req, res) => {
  try {
    const {
      type,
      area,
      minPrice,
      maxPrice,
      foodType,
      search,
      page = 1,
      limit = 9,
    } = req.query;

    let query = { status: "active" };

    if (type) query.type = type;
    if (area) query.area = area;
    if (foodType) query.foodType = foodType;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { area: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Resource.countDocuments(query);

    const resources = await Resource.find(query)
      .populate("createdBy", "name email")
      .sort({ featured: -1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      count: resources.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      data: resources,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/resources/my-listings
// @desc    Get logged-in user's own listings — DASHBOARD FIX
// @access  Private
router.get("/my-listings", protect, async (req, res) => {
  try {
    const resources = await Resource.find({
      createdBy: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: resources.length,
      data: resources,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/resources/upload-image
// @desc    Upload image to Cloudinary
// @access  Private
router.post(
  "/upload-image",
  protect,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No image uploaded",
        });
      }
      res.json({
        success: true,
        imageUrl: req.file.path,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
);

// @route   GET /api/resources/:id
// @desc    Get single resource
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("reviews.user", "name");

    if (!resource) {
      return res
        .status(404)
        .json({ success: false, message: "Resource not found" });
    }

    resource.views += 1;
    await resource.save();

    res.json({ success: true, data: resource });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/resources
// @desc    Create new resource
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const resourceData = {
      ...req.body,
      createdBy: req.user._id,
    };
    const resource = await Resource.create(resourceData);
    res.status(201).json({
      success: true,
      message: "Resource created successfully",
      data: resource,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/resources/:id
// @desc    Update resource
// @access  Private
router.put("/:id", protect, async (req, res) => {
  try {
    let resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res
        .status(404)
        .json({ success: false, message: "Resource not found" });
    }

    if (
      resource.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this resource",
      });
    }

    resource = await Resource.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: "Resource updated successfully",
      data: resource,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/resources/:id
// @desc    Delete resource
// @access  Private
router.delete("/:id", protect, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res
        .status(404)
        .json({ success: false, message: "Resource not found" });
    }

    if (
      resource.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this resource",
      });
    }

    await resource.deleteOne();
    res.json({ success: true, message: "Resource deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/resources/:id/reviews
// @desc    Add review
// @access  Private
router.post("/:id/reviews", protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res
        .status(404)
        .json({ success: false, message: "Resource not found" });
    }

    const alreadyReviewed = resource.reviews.find(
      (r) => r.user.toString() === req.user._id.toString(),
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this resource",
      });
    }

    resource.reviews.push({
      user: req.user._id,
      userName: req.user.name,
      rating: Number(rating),
      comment,
    });

    await resource.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: resource,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/resources/:id/reviews/:reviewId
// @desc    Delete review
// @access  Private
router.delete("/:id/reviews/:reviewId", protect, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res
        .status(404)
        .json({ success: false, message: "Resource not found" });
    }

    const review = resource.reviews.id(req.params.reviewId);

    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    if (
      review.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this review",
      });
    }

    review.deleteOne();
    await resource.save();

    res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
