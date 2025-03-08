export default class Features {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  pagination() {
    let page = this.queryString.page * 1 || 1;
    if (this.queryString.page * 1 <= 0) page = 1;
    let skip = (page - 1) * 20;
    this.page = page;
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(20);
    return this;
  }

  filter() {
    let filterObj = { ...this.queryString };
    let excludedQuery = ["page", "sort", "fields", "keyword"];
    excludedQuery.forEach((key) => {
      delete filterObj[key];
    });
    filterObj = JSON.stringify(filterObj);
    filterObj = filterObj.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (match) => `$${match}`
    );
    filterObj = JSON.parse(filterObj);
    this.mongooseQuery = this.mongooseQuery.find(filterObj);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      let sortedBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery.sort(sortedBy);
    }
    return this;
  }

  search() {
    if (this.queryString.keyword) {
      this.mongooseQuery.find({
        $or: [{ name: { $regex: this.queryString.keyword, $options: "i" } }],
      });
    }
    return this;
  }

  fields() {
    if (this.queryString.fields) {
      let fields = this.queryString.fields
        .split(",")
        .map((field) => field.trim());
      this.mongooseQuery.select(fields);
    }
    return this;
  }
}
