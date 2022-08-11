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

exports.getAllTours = async (req, res) => {
  try {
    // const queryObject = { ...req.query };

    // FILTERING
    // const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // excludedFields.forEach(el => delete queryObject[el]);
    //
    // let queryString = JSON.stringify(queryObject);
    //
    // queryString = queryString.replace(
    //   /\b(gt|gte|lt|lte)\b/g,
    //   match => `$${match}`
    // );
    //
    // let Query = Tour.find(JSON.parse(queryString));

    // SORTING
    // if (req.query.sort) {
    //   const SortBy = req.query.sort;
    //   if (typeof SortBy === 'string') {
    //     Query = Query.sort(SortBy.split(',').join(' '));
    //   }
    // } else {
    //   Query = Query.sort('price');
    // }
    // FIELDS

    // if (req.query.fields) {
    //   let Fields = req.query.fields;
    //   if (typeof Fields === 'string') {
    //     Fields = Fields.split(',').join(' ');
    //     Query = Query.select(Fields);
    //   }
    // }

    // PAGINATION

    // if (req.query.page && req.query.limit) {
    //   const limit = Number(req.query.limit);
    //   const skip = (Number(req.query.page) - 1) * limit;
    //   const NumberOfTours = await Tour.countDocuments();
    //
    //   if (skip >= NumberOfTours) {
    //     throw new Error("Page doesn't exist");
    //   }
    //
    //   Query = Query.skip(skip).limit(limit);
    // } else {
    //   Query = Query.skip(0).limit(10);
    // }

    const Feature = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .fields()
      .paginate();

    const tours = [...(await Feature.query)];

    res.status(200).json({
      status: 'succes',
      results: tours.length,
      data: {
        tours
      }
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 'failled',
      error: err
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'succes',
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'failled',
      error: err
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const newTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(201).json({
      status: 'succes',
      data: {
        tour: newTour
      }
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 'failed',
      error: err
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(202).json({
      status: 'succes'
    });
  } catch (err) {
    console.log(err);
    res.status(204).json({
      status: 'failed',
      error: err
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'succes',
      data: {
        tour: newTour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      error: err
    });
  }
};
