const Tour = require('../models/tourModel');

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObject = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObject[el]);

    let queryString = JSON.stringify(queryObject);

    queryString = queryString.replace(
      /\b(gt|gte|lt|lte)\b/g,
      match => `$${match}`
    );

    this.query = Tour.find(JSON.parse(queryString));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const SortBy = this.queryString.sort;
      if (typeof SortBy === 'string') {
        this.query = this.query.sort(SortBy.split(',').join(' '));
      }
    } else {
      this.query = this.query.sort('price');
    }
    return this;
  }

  fields() {
    if (this.queryString.fields) {
      let Fields = this.queryString.fields;
      if (typeof Fields === 'string') {
        Fields = Fields.split(',').join(' ');
        this.query = this.query.select(Fields);
      }
    }
    return this;
  }

  paginate() {
    if (this.queryString.page && this.queryString.limit) {
      const limit = Number(this.queryString.limit);
      const skip = (Number(this.queryString.page) - 1) * limit;
      this.query = this.query.skip(skip).limit(limit);
    } else {
      this.query = this.query.skip(0).limit(10);
    }
    return this;
  }
}

module.exports = APIFeatures;
