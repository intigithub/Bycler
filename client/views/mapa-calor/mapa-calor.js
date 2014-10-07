Template.heatmapPoints.herlpers({
    points: function() {
        for(var i=0; i<Tracker.find().count; 
    }
});



Template.postsList.helpers({
  postsWithRank: function() {
    this.posts.rewind();
    return this.posts.map(function(post, index, cursor) {
      post._rank = index;
      return post;
    });
  }
});