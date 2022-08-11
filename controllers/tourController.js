const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

exports.getAllTours = async (req, res) => {
  try {
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
