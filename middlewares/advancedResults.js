const advancedResults = (model, populate) => async (req, res, next) => {
  var reqQuery = { ...req.query };
  let noQueryFields = ["select", "sort", "limit", "page"];
  noQueryFields.forEach(field => delete reqQuery[field]);

  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  let query = model.find(JSON.parse(queryStr));

  if (populate) {
    query = query.populate(populate);
  }

  if (req.query.select) {
    let selectedStr = req.query.select.split(",").join(" ");
    query = query.select(selectedStr);
  }
  if (req.query.sort) {
    let sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  }

  let limit = parseInt(req.query.limit) || 20;
  let page = parseInt(req.query.page) || 1;
  let pagination = {};
  let total = await model.countDocuments();

  if (page * limit < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }
  if (page > 1) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  query = query.skip((page - 1) * limit).limit(limit);

  const results = await query;

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results
  }

  next();
}

module.exports = advancedResults