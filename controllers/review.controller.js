import Review from "../models/review.model.js";
import Form from "../models/listing.model.js";
import User from "../models/user.model.js";


export const postReview = async (req, res) => {
  try {
    const { formId } = req.params;
    const { title, content, rating } = req.body;
    const userId = req.user._id; // Logged-in user ID

    // ✅ Check if the listing exists
    const listing = await Form.findById(formId);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // ✅ Prevent user from reviewing their own listing
    if (listing.buyerId.toString() === userId.toString()) {
      return res.status(403).json({ message: "You cannot review your own listing" });
    }

    // ✅ Create the review
    const review = new Review({
      listing: formId,
      author: userId,
      title,
      content,
      rating,
    });

    const savedReview = await review.save();

    // ✅ Add review reference to the listing
    await Form.findByIdAndUpdate(formId, { $push: { reviews: savedReview._id } });

    // ✅ Add review reference to the user
    await User.findByIdAndUpdate(userId, { $push: { reviews: savedReview._id } });

    res.status(201).json({ message: "Review added successfully", review: savedReview });
  } catch (error) {
    console.error("❌ Error posting review:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


export const updateReview = async (req, res) => {

  try {
    const {reviewId} = req.params;

  const {title, content, rating} = req.body;
  const userId = req.user._id;  // loggedin user id

  // Check review exists or not
  const review = await Review.findById(reviewId);
  if(!review){
    return res.status(404).json({ message: "Review not found"});
  }

  // Ensure only the author can update the review
  if(review.author.toString() !== userId.toString()){
    return res.status(403).json({message: "Unauthorized to update this review"});
  }


  // Update the given fiels of review rest of the fields should be preserved
  review.title = title || review.title
  review.content = content || review.content
  review.rating = rating || review.rating
  await review.save();

  res.status(200).json({ message: "Review updated successfully", review });

  } catch (error) {
    console.error("�� Error updating review:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}


export const getAllReviews = async (req, res) => {
  try {
    const {formId} = req.params;

    // Check if the listing exists 
    const listing = await Form.findById(formId).populate("reviews");
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.status(200).json({ message: "Reviews fetched successfully", reviews: listing.reviews });

  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
    
  }
}


export const getUserReviews = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch reviews authored by the logged in user
    const reviews  = await Review.find({author: userId});

    return res.status(200).json({reviews});

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


export const deleteReview = async (req, res) => {
  try {
    const {reviewId} = req.params;

    const userId = req.user._id;  // logged-in user id

    // Check review exists or not
    const review = await Review.findById(reviewId);
    if(!review){
      return res.status(404).json({ message: "Review not found"});
    }

    // Ensure only the author can delete the review
    if(review.author.toString()!== userId.toString()){
      return res.status(403).json({message: "Unauthorized to delete this review"});
    }

    // remove review refrence from listing 
    await Form.findByIdAndDelete(review.listing, { $pull : {reviews: reviewId}});

    // remove review refrence from user
    await User.findByIdAndUpdate(review.author, { $pull : {reviews: reviewId}});


    // Delete the review 
    await Review.findByIdAndDelete(reviewId);

    res.status(200).json({ message: "Review deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}


// export const getListingsByRating = async (req, res) => {
//   try {
//     // Fetch all reviews 
//     const reviews  =  await Review.find().lean();

//     if(reviews.length === 0){
//       return res.status(404).json({
//         message: "No reviews found"
//       })
//     }

//     // Group reviews by listing and calculate the average rating 
//     const ratingMap = {};

//     reviews.forEach((review)=> {
//       const listingId = review.listing.toString();

//       if(!ratingMap[listingId]){
//         ratingMap[listingId] = {total : 0, count: 0};
//       }

//       ratingMap[listingId].total += review.rating;
//       ratingMap[listingId].count += 1;
//     });

//     // Calculate average rating for each listing 
//     const listingRatings = Object.keys(ratingMap).map((listingId) => {
//       const {total, count} = ratingMap[listingId];
//       return {listingId, averageRating: total / count}; // Calculate average rating 
//     })  ;

//     // Sort listings by average rating in descending order 
//     listingRatings.sort((a,b) => b.averageRating - a.averageRating);

//     // Fetch listings in sorted order 
//     const sortedListingsIds = listingRatings.map((item) => item.listingId);

//     const listings = await Form.find({ _id: { $in: sortedListingsIds}}).populate("reviews").lean();


//     // Attach average rating to listings 
//     const listingsWithRatings = listings.map((listing) => {
//       const ratingData = listingRatings.find((r) => r.listingId === listing._id.toString());
//       return {...listing, averageRating: ratingData? ratingData.averageRating : 0};
//     });

//     res.status(200).json({ listings: listingsWithRatings });


//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// }