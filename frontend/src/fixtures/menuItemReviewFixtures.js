const menuItemReviewFixtures = {
  oneReview: {
    id: 1,
    itemId: "10",
    reviewerEmail: "cgaucho@ucsb.edu",
    stars: 1,
    dateReviewed: "2022-01-02T12:00:00",
    comments: "bad",
  },
  threeReviews: [
    {
      id: 1,
      itemId: "10",
      reviewerEmail: "cgaucho@ucsb.edu",
      stars: 1,
      dateReviewed: "2022-01-02T12:00:00",
      comments: "bad",
    },
    {
      id: 2,
      itemId: "11",
      reviewerEmail: "cgaucho1@ucsb.edu",
      stars: 3,
      dateReviewed: "2022-01-02T12:00:00",
      comments: "ok",
    },
    {
      id: 3,
      itemId: "12",
      reviewerEmail: "cgaucho2@ucsb.edu",
      stars: 5,
      dateReviewed: "2022-01-02T12:00:00",
      comments: "good",
    },
  ],
};

export { menuItemReviewFixtures };
